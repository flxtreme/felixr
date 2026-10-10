"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FiSave, FiArrowLeft, FiEye, FiEdit3 } from "flxtheme/icons/fi";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { useDashboard } from "@/src/features/admin/DashboardContext";
import { FormBuilderProvider, useFormBuilder } from "@/src/features/admin/forms/FormBuilderContext";
import { FormBuilderPanel } from "@/src/features/admin/forms/components/FormBuilderPanel";
import { FormBuilderCanvas } from "@/src/features/admin/forms/components/FormBuilderCanvas";
import { FormBuilderToolbar } from "@/src/features/admin/forms/components/FormBuilderToolbar";
import { FormSettingsPanel } from "@/src/features/admin/forms/components/FormSettingsPanel";
import { TextField, NumberField, SelectField, AutocompleteField } from "@/src/components/forms/fields";
import type { Form, FormConfig, FormStatus, FormField, RowFieldConfig } from "@/src/features/admin/forms/types";
import { cln } from "@/src/utils/cln";

// Static map so Tailwind can detect the classes at build time
const GRID_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

interface FormBuilderEditorProps {
  formId?: string;
  isEdit?: boolean;
  form?: Form;
  onSave: (payload: { name: string; slug: string; status: FormStatus; config: FormConfig }) => Promise<void>;
  onAutoSaveConfig?: (config: FormConfig) => Promise<void>;
  title: string;
  description: string;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function RenderPreviewField({ field }: { field: FormField }) {
  switch (field.type) {
    case "text":
      return <TextField field={field as any} />;
    case "number":
      return <NumberField field={field as any} />;
    case "select":
      return <SelectField field={field as any} />;
    case "autocomplete":
      return <AutocompleteField field={field as any} />;
    case "button":
      return (
        <div className="pt-2">
          <AdminButton
            type={(field as any).buttonType || "button"}
            variant={(field as any).buttonVariant || "primary"}
          >
            {field.label || "Submit"}
          </AdminButton>
        </div>
      );
    case "title":
      return (
        <div className={(field as any).containerClass || ""}>
          <h2 className={(field as any).textClass || "text-xl font-bold"}>
            {(field as any).content || ""}
          </h2>
        </div>
      );
    case "paragraph":
      return (
        <div className={(field as any).containerClass || ""}>
          <p className={(field as any).textClass || "text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap"}>
            {(field as any).content || ""}
          </p>
        </div>
      );
    case "divider":
      return (
        <div className="py-2">
          <hr
            className={cln(
              "border-border",
              (field as any).lineStyle === "dashed" && "border-dashed",
              (field as any).lineStyle === "dotted" && "border-dotted"
            )}
          />
        </div>
      );
    case "row": {
      const c = field as RowFieldConfig;
      const isGrid = c.layoutType === "grid";
      const cols = c.columns || 2;
      const orientation = c.orientation || "horizontal";
      const children = c.children ?? [];
      return (
        <div
          className={cln(
            "w-full",
            isGrid
              ? `grid grid-cols-1 ${GRID_COLS[cols] ?? "md:grid-cols-2"} gap-4`
              : orientation === "horizontal"
              ? "flex flex-row flex-wrap items-center gap-4"
              : "flex flex-col gap-4"
          )}
        >
          {children.map((child) => (
            <RenderPreviewField key={child.id} field={child} />
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

function FormBuilderInner({
  formId,
  isEdit = false,
  form,
  onSave,
  onAutoSaveConfig,
  title,
  description,
}: FormBuilderEditorProps) {
  const { setGoBackUrl, setRightPanel } = useDashboard();
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(form?.name ?? "");
  const [slug, setSlug] = useState(form?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [status, setStatus] = useState<FormStatus>(form?.status ?? "DRAFT");

  const {
    fields,
    addField,
    moveField,
    moveFieldToContainer,
    shiftField,
    duplicateField,
    deleteField,
    updateField,
    selection,
    setSelection,
  } = useFormBuilder();

  useEffect(() => {
    setGoBackUrl("/admin/forms");
  }, [setGoBackUrl]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const config = { fields };
    const finalName = name.trim() || "Untitled Form";
    const finalSlug = slug.trim() || slugify(finalName) || "untitled-form";
    setIsSubmitting(true);
    setError(null);
    try {
      await onSave({ name: finalName, slug: finalSlug, status, config });
    } catch (err: any) {
      setError(err.message || "Failed to save form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = useCallback(
    (v: string) => {
      setName(v);
      if (!slugTouched) setSlug(slugify(v));
    },
    [slugTouched]
  );

  const handleSlugChange = useCallback((v: string) => {
    setSlugTouched(true);
    setSlug(v);
  }, []);

  const handleDuplicate = (kind: "field", id: string) => duplicateField(id);
  const handleDelete = (kind: "field", id: string) => deleteField(id);

  useEffect(() => {
    if (mode === "edit") {
      setRightPanel(
        <div className="space-y-8">
          <FormBuilderPanel
            selection={selection}
            fields={fields}
            onUpdateField={updateField}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        </div>
      );
    } else {
      setRightPanel(null);
    }
    return () => setRightPanel(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, form, selection, fields, name, slug, status]);

  return (
    <div className="flex flex-col min-h-0 h-full pt-10">
      <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
        <header className="px-8 pb-6 pt-6 border-b border-border shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-sm font-mono font-medium text-foreground/40">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Preview Toggle */}
              <div className="flex items-center rounded-lg border border-border bg-background p-1">
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className={cln(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors",
                    mode === "edit"
                      ? "bg-primary text-white font-semibold"
                      : "text-foreground/60 hover:text-foreground"
                  )}
                >
                  <FiEdit3 size={14} />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("preview")}
                  className={cln(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors",
                    mode === "preview"
                      ? "bg-primary text-white font-semibold"
                      : "text-foreground/60 hover:text-foreground"
                  )}
                >
                  <FiEye size={14} />
                  <span>Preview</span>
                </button>
              </div>

              <Link href="/admin/forms">
                <AdminButton type="button" variant="outline" className="gap-2">
                  <FiArrowLeft aria-hidden="true" />
                  <span>Cancel</span>
                </AdminButton>
              </Link>
              <AdminButton type="submit" disabled={isSubmitting} variant="primary" className="gap-2">
                <FiSave aria-hidden="true" />
                <span>{isSubmitting ? "Saving..." : "Save Form"}</span>
              </AdminButton>
            </div>
          </div>
        </header>

        {error && (
          <div className="px-8 pt-4">
            <div className="max-w-7xl mx-auto p-3 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-mono text-red-500 uppercase">
              {error}
            </div>
          </div>
        )}

        <div className="flex-1 py-6 overflow-y-auto">
          {mode === "edit" ? (
            <div className="h-full flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto px-6">
              {/* Left Toolbar - Draggable Components in Grid Cols 2 */}
              <div className="w-full xl:w-72 shrink-0">
                <div className="sticky top-0 space-y-4">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-foreground/40 font-semibold">
                    Components Palette
                  </h2>
                  <FormBuilderToolbar onAddField={addField} />
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 min-w-0">
                <FormBuilderCanvas
                  fields={fields}
                  selection={selection}
                  onSelectField={(id) => setSelection({ kind: "field", id })}
                  onAddField={addField}
                  onMoveField={moveField}
                  onMoveFieldToContainer={moveFieldToContainer}
                  onShiftField={shiftField}
                  onDuplicateField={duplicateField}
                  onDeleteField={deleteField}
                />
              </div>

              {/* Form Settings Sidebar */}
              <div className="w-full xl:w-72 shrink-0">
                <div className="sticky top-0">
                  <FormSettingsPanel
                    form={form}
                    name={name}
                    slug={slug}
                    status={status}
                    onNameChange={handleNameChange}
                    onSlugChange={handleSlugChange}
                    onStatusChange={setStatus}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-6 py-8">
              <div className="rounded-xl border border-border bg-background p-8 space-y-6 shadow-sm">
                <div className="border-b border-border pb-4">
                  <h2 className="text-xl font-bold">{name || "Untitled Form"}</h2>
                  <p className="text-xs font-mono text-foreground/40 mt-1">
                    Slug: /{slug || "untitled-form"} • Status: {status}
                  </p>
                </div>

                {fields.length === 0 ? (
                  <div className="py-12 text-center text-foreground/40 font-mono text-sm">
                    No components added to this form yet.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {fields.map((field) => (
                      <RenderPreviewField key={field.id} field={field} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export function FormBuilderEditor(props: FormBuilderEditorProps) {
  return (
    <FormBuilderProvider
      value={props.form?.config}
      defaultValue={{ fields: [] }}
      onChange={props.isEdit && props.formId && props.onAutoSaveConfig ? props.onAutoSaveConfig : undefined}
    >
      <FormBuilderInner {...props} />
    </FormBuilderProvider>
  );
}