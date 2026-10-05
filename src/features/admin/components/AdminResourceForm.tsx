"use client";

import { useEffect, useState, type FormEvent } from "react";
import { cln } from "@/src/utils/cln";
import { AdminButton } from "@/src/features/admin/components/AdminButton";

export interface AdminResourceField {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "url" | "date" | "textarea" | "list" | "boolean";
  required?: boolean;
  requiredOnCreate?: boolean;
  createOnly?: boolean;
  placeholder?: string;
}

type FormValues = Record<string, string | boolean>;

const readValue = (value: unknown, field: AdminResourceField): string | boolean => {
  if (field.type === "boolean") return Boolean(value);
  if (field.type === "list") return Array.isArray(value) ? value.join("\n") : "";
  return value == null ? "" : String(value);
};

export function AdminResourceForm({
  title,
  fields,
  initialValues,
  isEditing,
  isSaving,
  error,
  onClose,
  onSubmit,
}: {
  title: string;
  fields: AdminResourceField[];
  initialValues?: Record<string, unknown>;
  isEditing: boolean;
  isSaving: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}) {
  const [values, setValues] = useState<FormValues>({});

  useEffect(() => {
    setValues(Object.fromEntries(fields.map((field) => [field.name, readValue(initialValues?.[field.name], field)])));
  }, [fields, initialValues]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      if (isEditing && field.createOnly) continue;
      const value = values[field.name];
      if (field.name === "password" && !value) continue;
      payload[field.name] = field.type === "list"
        ? String(value ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
        : value;
    }
    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-background/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="admin-record-form-title" className="my-auto max-h-[90vh] w-full max-w-xl space-y-5 overflow-y-auto border border-foreground/15 bg-background/95 p-6 shadow-2xl backdrop-blur-md">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id="admin-record-form-title" className="text-xl font-bold lowercase">{isEditing ? "edit" : "new"} {title}</h2>
            <p className="mt-1 text-xs font-mono text-foreground/40">Fields marked required must be completed.</p>
          </div>
          <AdminButton type="button" onClick={onClose} variant="ghost">close</AdminButton>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.filter((field) => !(isEditing && field.createOnly)).map((field) => (
            <label key={field.name} className={cln("space-y-1.5 text-xs font-mono text-foreground/65", (field.type === "textarea" || field.type === "list") && "sm:col-span-2")}>
              <span className="block uppercase tracking-wide">{field.label}{(field.required || (field.requiredOnCreate && !isEditing)) ? " *" : ""}</span>
              {field.type === "boolean" ? (
                <span className="flex items-center gap-2 border border-foreground/15 px-3 py-2 text-sm normal-case text-foreground">
                  <input type="checkbox" checked={Boolean(values[field.name])} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.checked }))} />
                  enabled
                </span>
              ) : field.type === "textarea" || field.type === "list" ? (
                <textarea required={field.required || (field.requiredOnCreate === true && !isEditing)} value={String(values[field.name] ?? "")} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} placeholder={field.placeholder ?? (field.type === "list" ? "One item per line" : "")} rows={field.type === "list" ? 4 : 3} className="w-full resize-y border border-foreground/15 bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              ) : (
                <input type={field.type ?? "text"} required={field.required || (field.requiredOnCreate === true && !isEditing)} value={String(values[field.name] ?? "")} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} placeholder={field.placeholder} className="h-10 w-full border border-foreground/15 bg-transparent px-3 text-sm text-foreground outline-none focus:border-primary" />
              )}
            </label>
          ))}
        </div>
        {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
        <footer className="flex justify-end gap-3 border-t border-dashed border-foreground/10 pt-4">
          <AdminButton type="button" onClick={onClose} variant="outline">cancel</AdminButton>
          <AdminButton type="submit" disabled={isSaving} variant="primary">{isSaving ? "saving..." : "save"}</AdminButton>
        </footer>
      </form>
    </div>
  );
}
