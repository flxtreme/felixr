"use client";

import React from "react";
import { FiFileText, FiArchive, FiGlobe } from "flxtheme/icons/fi";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import type { Form, FormStatus } from "@/src/features/admin/forms/types";

interface FormSettingsPanelProps {
  form?: Form;
  name: string;
  slug: string;
  status: FormStatus;
  onNameChange: (name: string) => void;
  onSlugChange: (slug: string) => void;
  onStatusChange: (status: FormStatus) => void;
}

const inputCls =
  "w-full h-9 bg-transparent border border-foreground/15 px-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary";

export function FormSettingsPanel({
  form, name, slug, status, onNameChange, onSlugChange, onStatusChange,
}: FormSettingsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-foreground/45" htmlFor="form-name">Form Name</label>
          <input id="form-name" type="text" value={name} onChange={(e) => onNameChange(e.target.value)}
            className={inputCls} placeholder="My Contact Form" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-foreground/45" htmlFor="form-slug">Slug</label>
          <input id="form-slug" type="text" value={slug} onChange={(e) => onSlugChange(e.target.value)}
            className={inputCls} placeholder="my-contact-form" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-foreground/45">Status</label>
          <div className="space-y-2">
            {(["DRAFT", "PUBLISHED", "ARCHIVED"] as FormStatus[]).map((s) => (
              <AdminButton key={s} type="button" variant={status === s ? "primary" : "outline"} size="sm"
                className="flex-1 gap-1 w-full" onClick={() => onStatusChange(s)}>
                {s === "DRAFT" && <FiFileText size={14} />}
                {s === "PUBLISHED" && <FiGlobe size={14} />}
                {s === "ARCHIVED" && <FiArchive size={14} />}
                <span className="text-xs">{s}</span>
              </AdminButton>
            ))}
          </div>
        </div>

        {form && (
          <div className="pt-4 border-t border-border space-y-1 text-xs text-foreground/50">
            <p><strong>Form ID:</strong> {form.id}</p>
            <p><strong>Created:</strong> {new Date(form.createdAt).toLocaleString()}</p>
            <p><strong>Updated:</strong> {new Date(form.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}