"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { FormField, FormConfig, FieldDefinition, FormBuilderProps, Selection, RowFieldConfig } from "@/src/features/admin/forms/types";

const generateId = (prefix = "field") =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

function uniqueId(base: string, taken: string[]) {
  if (!taken.includes(base)) return base;
  let id = generateId(base.replace(/-[a-z0-9]{6}$/, "") || "item");
  while (taken.includes(id)) id = generateId("item");
  return id;
}

export function getAllFieldIds(fields: FormField[]): string[] {
  const ids: string[] = [];
  for (const f of fields) {
    ids.push(f.id);
    if (f.type === "row" && (f as RowFieldConfig).children) {
      ids.push(...getAllFieldIds((f as RowFieldConfig).children!));
    }
  }
  return ids;
}

export function findFieldById(fields: FormField[], id: string): FormField | undefined {
  for (const f of fields) {
    if (f.id === id) return f;
    if (f.type === "row" && (f as RowFieldConfig).children) {
      const found = findFieldById((f as RowFieldConfig).children!, id);
      if (found) return found;
    }
  }
  return undefined;
}

/** Returns the id of the row containing `id`, `undefined` if it is at root, `null` if not found. */
function findParentId(fields: FormField[], id: string, parentId?: string): string | undefined | null {
  for (const f of fields) {
    if (f.id === id) return parentId;
    if (f.type === "row" && (f as RowFieldConfig).children) {
      const found = findParentId((f as RowFieldConfig).children!, id, f.id);
      if (found !== null) return found;
    }
  }
  return null;
}

function getSiblings(fields: FormField[], parentId?: string): FormField[] {
  if (!parentId) return fields;
  const parent = findFieldById(fields, parentId) as RowFieldConfig | undefined;
  return parent?.children ?? [];
}

/** Deep clone with fresh ids for the field and any children. */
function cloneWithNewIds(field: FormField): FormField {
  const copy = clone(field) as FormField;
  copy.id = generateId(String(copy.type));
  if (copy.type === "row" && (copy as RowFieldConfig).children) {
    (copy as RowFieldConfig).children = (copy as RowFieldConfig).children!.map(cloneWithNewIds);
  }
  return copy;
}

function updateFieldRecursive(fields: FormField[], id: string, patch: Record<string, unknown>): FormField[] {
  return fields.map((f) => {
    if (f.id === id) {
      const next: Record<string, unknown> = { ...f, ...patch };
      Object.keys(patch).forEach((k) => {
        if (patch[k] === undefined) delete next[k];
      });
      return next as FormField;
    }
    if (f.type === "row" && (f as RowFieldConfig).children) {
      return {
        ...f,
        children: updateFieldRecursive((f as RowFieldConfig).children!, id, patch),
      } as RowFieldConfig;
    }
    return f;
  });
}

function deleteFieldRecursive(fields: FormField[], id: string): FormField[] {
  return fields
    .filter((f) => f.id !== id)
    .map((f) => {
      if (f.type === "row" && (f as RowFieldConfig).children) {
        return {
          ...f,
          children: deleteFieldRecursive((f as RowFieldConfig).children!, id),
        } as RowFieldConfig;
      }
      return f;
    });
}

function addFieldToContainer(fields: FormField[], containerId: string, newField: FormField, index?: number): FormField[] {
  // Prevent nesting a row inside another row
  if (newField.type === "row") return fields;

  return fields.map((f) => {
    if (f.id === containerId && f.type === "row") {
      const children = [...((f as RowFieldConfig).children ?? [])];
      const targetIdx = index !== undefined ? index : children.length;
      children.splice(targetIdx, 0, newField);
      return { ...f, children } as RowFieldConfig;
    }
    if (f.type === "row" && (f as RowFieldConfig).children) {
      return {
        ...f,
        children: addFieldToContainer((f as RowFieldConfig).children!, containerId, newField, index),
      } as RowFieldConfig;
    }
    return f;
  });
}

interface FormBuilderContextValue {
  fields: FormField[];
  selection: Selection;
  setSelection: React.Dispatch<React.SetStateAction<Selection>>;
  addField: (def: FieldDefinition, index?: number, containerId?: string) => void;
  moveField: (id: string, to: number, containerId?: string) => void;
  moveFieldToContainer: (id: string, targetContainerId?: string, index?: number) => void;
  shiftField: (id: string, dir: -1 | 1) => void;
  duplicateField: (id: string) => void;
  deleteField: (id: string) => void;
  updateField: (id: string, patch: Record<string, unknown>) => void;
}

const FormBuilderContext = createContext<FormBuilderContextValue | null>(null);

export function FormBuilderProvider({
  children,
  value: initialValue,
  defaultValue,
  onChange,
}: FormBuilderProps & { children: React.ReactNode }) {
  const [config, setConfig] = useState<FormConfig>(initialValue ?? defaultValue ?? { fields: [] });
  const [selection, setSelection] = useState<Selection>(null);

  const fields = config.fields ?? [];

  // Fire onChange (e.g. autosave) after state updates, never inside a state updater, and skip the initial mount.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    onChangeRef.current?.(config);
  }, [config]);

  const commit = useCallback((next: { fields?: FormField[] }) => {
    setConfig((prev) => ({
      ...prev,
      fields: next.fields ?? prev.fields,
    }));
  }, []);

  const addField = useCallback(
    (def: FieldDefinition, index?: number, containerId?: string) => {
      // Prevent row inside row
      if (def.type === "row" && containerId) return;

      const f = def.createDefault() as unknown as FormField;
      const allIds = getAllFieldIds(fields);
      f.id = uniqueId(f.id, allIds);

      if (containerId) {
        commit({ fields: addFieldToContainer(fields, containerId, f, index) });
      } else {
        const copy = [...fields];
        const targetIdx = index !== undefined ? index : copy.length;
        copy.splice(targetIdx, 0, f);
        commit({ fields: copy });
      }
      setSelection({ kind: "field", id: f.id });
    },
    [fields, commit]
  );

  const moveField = useCallback(
    (id: string, to: number, containerId?: string) => {
      if (containerId) {
        const container = findFieldById(fields, containerId) as RowFieldConfig | undefined;
        if (!container || !container.children) return;
        const children = [...container.children];
        const from = children.findIndex((x) => x.id === id);
        if (from >= 0) {
          const [item] = children.splice(from, 1);
          children.splice(from < to ? to - 1 : to, 0, item);
          commit({ fields: updateFieldRecursive(fields, containerId, { children }) });
        }
      } else {
        const from = fields.findIndex((x) => x.id === id);
        if (from < 0) return;
        const copy = [...fields];
        const [item] = copy.splice(from, 1);
        copy.splice(from < to ? to - 1 : to, 0, item);
        commit({ fields: copy });
      }
    },
    [fields, commit]
  );

  const moveFieldToContainer = useCallback(
    (id: string, targetContainerId?: string, index?: number) => {
      const fieldToMove = findFieldById(fields, id);
      if (!fieldToMove) return;

      // Prevent dropping a row into a row, or a row into itself
      if (fieldToMove.type === "row" && targetContainerId) return;
      if (fieldToMove.id === targetContainerId) return;

      // If moving within the same parent to a later slot, removal shifts the target index down by one
      let targetIndex = index;
      const currentParentId = findParentId(fields, id);
      if (currentParentId !== null && currentParentId === targetContainerId && targetIndex !== undefined) {
        const from = getSiblings(fields, currentParentId).findIndex((x) => x.id === id);
        if (from >= 0 && from < targetIndex) targetIndex -= 1;
      }

      // Remove from current position
      const cleanedFields = deleteFieldRecursive(fields, id);

      if (targetContainerId) {
        commit({ fields: addFieldToContainer(cleanedFields, targetContainerId, fieldToMove, targetIndex) });
      } else {
        const copy = [...cleanedFields];
        const targetIdx = targetIndex !== undefined ? targetIndex : copy.length;
        copy.splice(targetIdx, 0, fieldToMove);
        commit({ fields: copy });
      }
      setSelection({ kind: "field", id });
    },
    [fields, commit]
  );

  const shiftField = useCallback(
    (id: string, dir: -1 | 1) => {
      const parentId = findParentId(fields, id);
      if (parentId === null) return;
      const siblings = getSiblings(fields, parentId);
      const i = siblings.findIndex((f) => f.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= siblings.length) return;
      const copy = [...siblings];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      commit({
        fields: parentId ? updateFieldRecursive(fields, parentId, { children: copy }) : copy,
      });
    },
    [fields, commit]
  );

  const duplicateField = useCallback(
    (id: string) => {
      const target = findFieldById(fields, id);
      if (!target) return;
      const parentId = findParentId(fields, id);
      if (parentId === null) return;

      const copy = cloneWithNewIds(target);
      const siblings = [...getSiblings(fields, parentId)];
      const i = siblings.findIndex((f) => f.id === id);
      siblings.splice(i + 1, 0, copy);

      commit({
        fields: parentId ? updateFieldRecursive(fields, parentId, { children: siblings }) : siblings,
      });
      setSelection({ kind: "field", id: copy.id });
    },
    [fields, commit]
  );

  const deleteField = useCallback(
    (id: string) => {
      const target = findFieldById(fields, id);
      commit({ fields: deleteFieldRecursive(fields, id) });
      if (selection && target) {
        const removedIds = getAllFieldIds([target]);
        if (removedIds.includes(selection.id)) setSelection(null);
      }
    },
    [fields, commit, selection]
  );

  const updateField = useCallback(
    (id: string, patch: Record<string, unknown>) => {
      commit({ fields: updateFieldRecursive(fields, id, patch) });
      if (typeof patch.id === "string" && selection?.id === id)
        setSelection({ kind: "field", id: patch.id });
    },
    [fields, commit, selection]
  );

  const value = useMemo(
    () => ({
      fields,
      selection,
      setSelection,
      addField,
      moveField,
      moveFieldToContainer,
      shiftField,
      duplicateField,
      deleteField,
      updateField,
    }),
    [
      fields,
      selection,
      setSelection,
      addField,
      moveField,
      moveFieldToContainer,
      shiftField,
      duplicateField,
      deleteField,
      updateField,
    ]
  );

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilder(
  value?: FormConfig | undefined,
  defaultValue?: FormConfig | undefined,
  onChange?: (c: FormConfig) => void
) {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within FormBuilderProvider");
  }
  return context;
}