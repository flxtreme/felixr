"use client";

import React, { useState, useCallback } from "react";
import { FiMove, FiPlus, FiTrash2, FiCopy, FiArrowUp, FiArrowDown } from "flxtheme/icons/fi";
import { IconButton } from "flxtheme";
import { cln } from "@/src/utils/cln";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { TextField, NumberField, SelectField, AutocompleteField } from "@/src/components/forms/fields";
import { builtInFieldDefinitions } from "@/src/features/admin/forms/types";
import type { FormField, FieldDefinition, RowFieldConfig } from "@/src/features/admin/forms/types";
import { PALETTE_FIELD_MIME } from "./FormBuilderToolbar";
import { findFieldById } from "../FormBuilderContext";

const fieldRegistry: Record<string, React.ComponentType<any>> = {
  text: TextField,
  number: NumberField,
  select: SelectField,
  autocomplete: AutocompleteField,
};

// Static map so Tailwind can detect the classes at build time
const GRID_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

type InternalDrag = { kind: "field"; id: string } | null;

interface FormBuilderCanvasProps {
  fields: FormField[];
  selection: { kind: "field"; id: string } | null;
  onSelectField: (id: string) => void;
  onAddField: (def: FieldDefinition, index?: number, containerId?: string) => void;
  onMoveField: (id: string, to: number, containerId?: string) => void;
  onMoveFieldToContainer: (id: string, containerId?: string, index?: number) => void;
  onShiftField: (id: string, dir: -1 | 1) => void;
  onDuplicateField: (id: string) => void;
  onDeleteField: (id: string) => void;
}

const DropLine = () => (
  <div
    aria-hidden="true"
    className="my-2 h-1 w-full rounded-full bg-primary"
  />
);

export function FormBuilderCanvas({
  fields,
  selection,
  onSelectField,
  onAddField,
  onMoveField,
  onMoveFieldToContainer: moveFieldToContainer,
  onShiftField,
  onDuplicateField,
  onDeleteField,
}: FormBuilderCanvasProps) {
  const [drag, setDrag] = useState<InternalDrag>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const resetDrag = useCallback(() => {
    setDrag(null);
    setDropIndex(null);
  }, []);

  const dropField = (e: React.DragEvent) => {
    e.preventDefault();
    const index = dropIndex ?? fields.length;
    const textData = e.dataTransfer.getData("text/plain") || "";
    const mimeTypeData = e.dataTransfer.getData(PALETTE_FIELD_MIME);

    if (textData.startsWith("palette:") || mimeTypeData) {
      const fieldType = textData.replace("palette:", "") || mimeTypeData;
      const def = builtInFieldDefinitions.find((d) => String(d.type) === fieldType);
      if (def) onAddField(def, index);
    } else if (textData.startsWith("field:") || drag?.kind === "field") {
      const fieldId = textData.replace("field:", "") || drag?.id;
      if (fieldId) {
        moveFieldToContainer(fieldId, undefined, index);
      }
    }
    resetDrag();
  };

  const fieldsActive = drag?.kind === "field" || dropIndex !== null;

  return (
    <div className="space-y-6">
      <section aria-label="Form Components" className="space-y-3">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            if (fields.length === 0) setDropIndex(0);
            else if (e.target === e.currentTarget) setDropIndex(fields.length);
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropIndex(null);
          }}
          onDrop={dropField}
          className={cln(
            "flex min-h-[400px] flex-col gap-3 rounded-lg border-2 border-dashed p-4 transition-colors",
            fieldsActive ? "border-primary/30 bg-primary/5" : "border-foreground/10 bg-background/30"
          )}
        >
          {fields.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-foreground/40 py-16">
              <FiPlus size={48} className="mb-4 opacity-30" />
              <p className="text-sm font-mono">Drag components here or click components on the toolbar</p>
              {dropIndex === 0 && <DropLine />}
            </div>
          )}

          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              {dropIndex === index && <DropLine />}
              <FieldCard
                field={field}
                index={index}
                total={fields.length}
                isSelected={selection?.kind === "field" && selection.id === field.id}
                selection={selection}
                resetDrag={resetDrag}
                allFields={fields}
                onSelectField={onSelectField}
                onAddField={onAddField}
                onMoveField={onMoveField}
                onMoveFieldToContainer={moveFieldToContainer}
                onDuplicate={() => onDuplicateField(field.id)}
                onDelete={() => onDeleteField(field.id)}
                onDeleteById={onDeleteField}
                onShift={onShiftField}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "copyMove";
                  e.dataTransfer.setData("text/plain", `field:${field.id}`);
                  setDrag({ kind: "field", id: field.id });
                }}
                onDragEnd={resetDrag}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDropIndex(e.clientY < rect.top + rect.height / 2 ? index : index + 1);
                }}
              />
            </React.Fragment>
          ))}

          {dropIndex === fields.length && fields.length > 0 && <DropLine />}
        </div>
      </section>
    </div>
  );
}

interface FieldCardProps {
  field: FormField;
  index: number;
  total: number;
  isSelected: boolean;
  selection: { kind: "field"; id: string } | null;
  resetDrag: () => void;
  allFields: FormField[];
  onSelectField: (id: string) => void;
  onAddField: (def: FieldDefinition, index?: number, containerId?: string) => void;
  onMoveField: (id: string, to: number, containerId?: string) => void;
  onMoveFieldToContainer: (id: string, targetContainerId?: string, index?: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onDeleteById: (id: string) => void;
  onShift: (id: string, dir: -1 | 1) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
}

function RowPreview({
  field,
  selection,
  resetDrag,
  allFields,
  onSelectField,
  onAddField,
  onMoveFieldToContainer,
  onDeleteById,
}: {
  field: FormField;
  selection: { kind: "field"; id: string } | null;
  resetDrag: () => void;
  allFields: FormField[];
  onSelectField: (id: string) => void;
  onAddField: (def: FieldDefinition, index?: number, containerId?: string) => void;
  onMoveFieldToContainer: (id: string, targetContainerId?: string, index?: number) => void;
  onDeleteById: (id: string) => void;
}) {
  const rowConfig = field as RowFieldConfig;
  const isGrid = rowConfig.layoutType === "grid";
  const cols = rowConfig.columns || 2;
  const orientation = rowConfig.orientation || "horizontal";
  const children = rowConfig.children ?? [];
  const [isDragOver, setIsDragOver] = useState(false);

  const handleRowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const textData = e.dataTransfer.getData("text/plain") || "";
    const mimeTypeData = e.dataTransfer.getData(PALETTE_FIELD_MIME);

    if (textData.startsWith("palette:") || mimeTypeData) {
      const fieldType = textData.replace("palette:", "") || mimeTypeData;
      // Prevent nesting a row inside a row
      if (fieldType === "row") {
        resetDrag();
        return;
      }
      const def = builtInFieldDefinitions.find((d) => String(d.type) === fieldType);
      if (def) {
        onAddField(def, children.length, field.id);
      }
    } else if (textData.startsWith("field:")) {
      const draggedFieldId = textData.replace("field:", "");
      if (draggedFieldId && draggedFieldId !== field.id) {
        const draggedField = findFieldById(allFields, draggedFieldId);
        // Prevent nesting a row inside a row
        if (draggedField?.type === "row") {
          resetDrag();
          return;
        }
        onMoveFieldToContainer(draggedFieldId, field.id, children.length);
      }
    }
    resetDrag();
  };

  return (
    <div className="space-y-3">
      <div className="text-xs font-mono uppercase text-foreground/40 font-semibold flex items-center justify-between">
        <span>{field.label || "Row Layout"}</span>
        <span className="text-[10px] bg-foreground/10 px-2 py-0.5 rounded font-mono">
          {isGrid ? `Grid (${cols} cols)` : `Flex (${orientation})`}
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = "copy";
          resetDrag();
          if (!isDragOver) setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
          }
        }}
        onDrop={handleRowDrop}
        className={cln(
          "min-h-[120px] rounded-lg border-2 border-dashed p-4 transition-all",
          isDragOver
            ? "border-primary bg-primary/10 ring-2 ring-primary/30"
            : "border-primary/25 bg-primary/5 hover:border-primary/40"
        )}
      >
        {children.length === 0 ? (
          <div className="col-span-full w-full py-8 text-center text-xs font-mono text-foreground/50 border border-dashed border-foreground/20 rounded-md flex flex-col items-center justify-center gap-1.5">
            <FiPlus size={20} className="opacity-50 text-primary" />
            <span>Drop components here (palette or existing fields, no row nesting)</span>
          </div>
        ) : (
          <div
            className={cln(
              "w-full",
              isGrid
                ? `grid grid-cols-1 ${GRID_COLS[cols] ?? "md:grid-cols-2"} gap-3`
                : orientation === "horizontal"
                ? "flex flex-row flex-wrap gap-3"
                : "flex flex-col gap-3"
            )}
          >
            {children.map((child) => (
              <div
                key={child.id}
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  e.dataTransfer.effectAllowed = "copyMove";
                  e.dataTransfer.setData("text/plain", `field:${child.id}`);
                }}
                onDragEnd={(e) => {
                  e.stopPropagation();
                  resetDrag();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectField(child.id);
                }}
                className={cln(
                  "p-3 rounded-md border bg-background text-xs font-mono relative group/child cursor-grab hover:border-primary/50 transition-all shadow-xs flex-1",
                  selection?.id === child.id ? "border-primary ring-1 ring-primary" : "border-border"
                )}
              >
                <div className="flex items-center justify-between font-semibold uppercase text-[10px] text-foreground/50 mb-1.5">
                  <span className="flex items-center gap-1">
                    <FiMove size={12} className="opacity-40" />
                    {child.type}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteById(child.id);
                    }}
                    className="text-foreground/40 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="font-sans font-medium text-foreground/90">{child.label || child.id}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FieldPreview({
  field,
  selection,
  resetDrag,
  allFields,
  onSelectField,
  onAddField,
  onMoveFieldToContainer,
  onDeleteById,
}: {
  field: FormField;
  selection: { kind: "field"; id: string } | null;
  resetDrag: () => void;
  allFields: FormField[];
  onSelectField: (id: string) => void;
  onAddField: (def: FieldDefinition, index?: number, containerId?: string) => void;
  onMoveFieldToContainer: (id: string, targetContainerId?: string, index?: number) => void;
  onDeleteById: (id: string) => void;
}) {
  const Cmp = fieldRegistry[String(field.type)];

  if (Cmp) {
    return <Cmp field={field} readOnly />;
  }

  switch (field.type) {
    case "button":
      return (
        <div className="pt-1">
          <AdminButton
            type={(field as any).buttonType || "button"}
            variant={(field as any).buttonVariant || "primary"}
            className="pointer-events-none"
          >
            {field.label || "Button"}
          </AdminButton>
        </div>
      );
    case "title":
      return (
        <div className={(field as any).containerClass || ""}>
          <h2 className={(field as any).textClass || "text-xl font-bold"}>
            {(field as any).content || "Section Title"}
          </h2>
        </div>
      );
    case "paragraph":
      return (
        <div className={(field as any).containerClass || ""}>
          <p className={(field as any).textClass || "text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap"}>
            {(field as any).content || "Paragraph content..."}
          </p>
        </div>
      );
    case "divider":
      return (
        <div className="py-2">
          <hr
            className={cln(
              "border-foreground/20",
              (field as any).lineStyle === "dashed" && "border-dashed",
              (field as any).lineStyle === "dotted" && "border-dotted"
            )}
          />
        </div>
      );
    case "row":
      return (
        <RowPreview
          field={field}
          selection={selection}
          resetDrag={resetDrag}
          allFields={allFields}
          onSelectField={onSelectField}
          onAddField={onAddField}
          onMoveFieldToContainer={onMoveFieldToContainer}
          onDeleteById={onDeleteById}
        />
      );
    default:
      return (
        <div className="rounded border border-dashed border-amber-400 bg-amber-50/50 px-3 py-2 text-sm text-amber-800 font-mono">
          {field.label || field.id} — type &quot;{String(field.type)}&quot;
        </div>
      );
  }
}

function FieldCard({
  field,
  index,
  total,
  isSelected,
  selection,
  resetDrag,
  allFields,
  onSelectField,
  onAddField,
  onMoveFieldToContainer,
  onDuplicate,
  onDelete,
  onDeleteById,
  onShift,
  onDragStart,
  onDragEnd,
  onDragOver,
}: FieldCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${field.label || field.id}, ${field.type} component, position ${index + 1} of ${total}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onClick={() => onSelectField(field.id)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectField(field.id);
        } else if (e.altKey && e.key === "ArrowUp") {
          e.preventDefault();
          onShift(field.id, -1);
        } else if (e.altKey && e.key === "ArrowDown") {
          e.preventDefault();
          onShift(field.id, 1);
        } else if (e.key === "Delete") {
          onDelete();
        }
      }}
      className={cln(
        "group relative cursor-grab rounded-lg border bg-background p-4 pt-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all select-none",
        isSelected ? "border-primary ring-1 ring-primary shadow-sm" : "border-foreground/10 hover:border-foreground/20"
      )}
    >
      <div className="absolute inset-x-3 top-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs text-foreground/50">
          {isSelected && <span className="text-primary font-bold">✓</span>}
          <FiMove className="text-foreground/30" aria-hidden="true" />
          <span className="font-mono uppercase font-semibold">{field.type}</span>
        </span>
        <span className="flex items-center gap-1">
          <IconButton
            icon={<FiArrowUp size={14} />}
            aria-label="Move up"
            disabled={index === 0}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onShift(field.id, -1);
            }}
          />
          <IconButton
            icon={<FiArrowDown size={14} />}
            aria-label="Move down"
            disabled={index === total - 1}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onShift(field.id, 1);
            }}
          />
          <IconButton
            icon={<FiCopy size={14} />}
            aria-label="Duplicate component"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          />
          <IconButton
            icon={<FiTrash2 size={14} />}
            aria-label="Delete component"
            variant="ghost"
            size="sm"
            className="hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </span>
      </div>

      <div>
        <FieldPreview
          field={field}
          selection={selection}
          resetDrag={resetDrag}
          allFields={allFields}
          onSelectField={onSelectField}
          onAddField={onAddField}
          onMoveFieldToContainer={onMoveFieldToContainer}
          onDeleteById={onDeleteById}
        />
      </div>
    </div>
  );
}