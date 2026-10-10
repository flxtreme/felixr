"use client";

import React from "react";
import { FiCopy, FiTrash2, FiSettings } from "flxtheme/icons/fi";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import type { FormField, Selection, FieldOption } from "@/src/features/admin/forms/types";
import { findFieldById } from "../FormBuilderContext";

interface FormBuilderPanelProps {
  selection: Selection;
  fields: FormField[];
  onUpdateField: (id: string, patch: Record<string, unknown>) => void;
  onDuplicate: (kind: "field", id: string) => void;
  onDelete: (kind: "field", id: string) => void;
}

const inputCls =
  "w-full h-9 bg-transparent border border-foreground/15 px-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary";
const selectCls =
  "w-full h-9 bg-background border border-foreground/15 px-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary";
const labelCls = "text-xs font-mono text-foreground/45";

function Text({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className={labelCls} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </div>
  );
}

function Num({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className={labelCls} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value ?? ""}
        className={inputCls}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      />
    </div>
  );
}

function Check({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-foreground/15 text-primary focus:ring-primary"
      />
      <label className="text-sm text-foreground" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: FieldOption[];
  onChange: (o: FieldOption[]) => void;
}) {
  const set = (i: number, patch: Partial<FieldOption>) =>
    onChange(options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
  return (
    <div className="space-y-2">
      <span className={labelCls}>Options</span>
      {options.map((o, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            aria-label={`Option ${i + 1} label`}
            placeholder="Label"
            value={o.label}
            onChange={(e) => set(i, { label: e.target.value })}
            className={inputCls}
          />
          <input
            aria-label={`Option ${i + 1} value`}
            placeholder="Value"
            value={o.value}
            onChange={(e) => set(i, { value: e.target.value })}
            className={inputCls}
          />
          <button
            type="button"
            aria-label={`Remove option ${i + 1}`}
            onClick={() => onChange(options.filter((_, idx) => idx !== i))}
            className="px-1 text-foreground/50 hover:text-red-500"
          >
            ✕
          </button>
        </div>
      ))}
      <AdminButton
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          const n = options.length + 1;
          onChange([...options, { label: `Option ${n}`, value: `option-${n}` }]);
        }}
      >
        + Add Option
      </AdminButton>
    </div>
  );
}

function Footer({ onDuplicate, onDelete }: { onDuplicate: () => void; onDelete: () => void }) {
  return (
    <div className="pt-4 border-t border-border flex gap-2">
      <AdminButton type="button" variant="outline" size="sm" onClick={onDuplicate} className="flex-1 gap-1">
        <FiCopy size={14} /> Duplicate
      </AdminButton>
      <AdminButton type="button" variant="outline" size="sm" onClick={onDelete} className="flex-1 gap-1 text-red-500">
        <FiTrash2 size={14} /> Delete
      </AdminButton>
    </div>
  );
}

export function FormBuilderPanel({
  selection,
  fields,
  onUpdateField,
  onDuplicate,
  onDelete,
}: FormBuilderPanelProps) {
  const empty = (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-foreground">Properties</h3>
      <div className="py-6 text-center text-foreground/50">
        <FiSettings size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Select a component to edit its properties</p>
      </div>
    </div>
  );

  if (!selection) return empty;

  // Use recursive findFieldById so child items inside rows are found!
  const f = findFieldById(fields, selection.id) as (FormField & Record<string, any>) | undefined;
  if (!f) return empty;

  const up = (patch: Record<string, unknown>) => onUpdateField(f.id, patch);
  const isChoice = f.type === "select" || f.type === "autocomplete";
  const isDisplayText = f.type === "title" || f.type === "paragraph";

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-foreground">Component Properties</h3>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Type</label>
          <div className="mt-1 text-sm font-mono font-medium text-foreground uppercase">{String(f.type)}</div>
        </div>

        {/* Label — hidden for display-only and layout types */}
        {!["divider", "title", "paragraph", "row"].includes(String(f.type)) && (
          <Text
            id="field-label"
            label="Label"
            value={f.label}
            placeholder="Enter label"
            onChange={(v) => up({ label: v })}
          />
        )}

        {/* Display text fields: Title + Paragraph */}
        {isDisplayText && (
          <>
            <div className="space-y-1.5">
              <label className={labelCls} htmlFor="display-content">
                Content
              </label>
              <textarea
                id="display-content"
                value={f.content ?? ""}
                placeholder={f.type === "title" ? "Section Title" : "Enter paragraph text..."}
                onChange={(e) => up({ content: e.target.value })}
                className="w-full min-h-[80px] bg-transparent border border-foreground/15 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <Text
              id="display-textClass"
              label="Text Classes (Tailwind)"
              value={f.textClass}
              placeholder={f.type === "title" ? "text-xl font-bold" : "text-sm text-foreground/80"}
              onChange={(v) => up({ textClass: v })}
            />
            <Text
              id="display-containerClass"
              label="Container Classes (Tailwind)"
              value={f.containerClass}
              placeholder="e.g. mb-4 px-2"
              onChange={(v) => up({ containerClass: v })}
            />
          </>
        )}

        {/* Input field shared properties */}
        {["text", "number", "select", "autocomplete"].includes(String(f.type)) && (
          <>
            <Text
              id="field-name"
              label="Name (Key)"
              value={f.name}
              placeholder="field_name"
              onChange={(v) => up({ name: v })}
            />
            <Text
              id="field-placeholder"
              label="Placeholder"
              value={f.placeholder}
              placeholder="Enter placeholder"
              onChange={(v) => up({ placeholder: v })}
            />
            <div className="space-y-1.5">
              <label className={labelCls} htmlFor="field-description">
                Description
              </label>
              <textarea
                id="field-description"
                value={f.description ?? ""}
                placeholder="Help text for users"
                onChange={(e) => up({ description: e.target.value })}
                className="w-full min-h-[80px] bg-transparent border border-foreground/15 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <Check
              id="field-required"
              label="Required"
              checked={!!f.required}
              onChange={(v) => up({ required: v || undefined })}
            />
            <Check
              id="field-disabled"
              label="Disabled"
              checked={!!f.disabled}
              onChange={(v) => up({ disabled: v || undefined })}
            />
          </>
        )}

        {f.type === "button" && (
          <>
            <div className="space-y-1.5">
              <label className={labelCls} htmlFor="button-variant">
                Button Variant
              </label>
              <select
                id="button-variant"
                value={f.buttonVariant || "primary"}
                onChange={(e) => up({ buttonVariant: e.target.value })}
                className={selectCls}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
                <option value="danger">Danger</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls} htmlFor="button-type">
                Button Action Type
              </label>
              <select
                id="button-type"
                value={f.buttonType || "submit"}
                onChange={(e) => up({ buttonType: e.target.value })}
                className={selectCls}
              >
                <option value="submit">Submit</option>
                <option value="reset">Reset</option>
                <option value="button">Button (Custom)</option>
              </select>
            </div>
          </>
        )}

        {f.type === "divider" && (
          <div className="space-y-1.5">
            <label className={labelCls} htmlFor="divider-style">
              Line Style
            </label>
            <select
              id="divider-style"
              value={f.lineStyle || "solid"}
              onChange={(e) => up({ lineStyle: e.target.value })}
              className={selectCls}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
        )}

        {f.type === "row" && (
          <>
            <div className="space-y-1.5">
              <label className={labelCls} htmlFor="row-layout">
                Layout Type
              </label>
              <select
                id="row-layout"
                value={f.layoutType || "flex"}
                onChange={(e) => up({ layoutType: e.target.value })}
                className={selectCls}
              >
                <option value="flex">Flexbox</option>
                <option value="grid">Grid</option>
              </select>
            </div>

            {f.layoutType === "grid" ? (
              <Num
                id="row-columns"
                label="Grid Columns (1-4)"
                value={f.columns || 2}
                onChange={(v) => up({ columns: Math.min(4, Math.max(1, v || 2)) })}
              />
            ) : (
              <div className="space-y-1.5">
                <label className={labelCls} htmlFor="row-orientation">
                  Flex Orientation
                </label>
                <select
                  id="row-orientation"
                  value={f.orientation || "horizontal"}
                  onChange={(e) => up({ orientation: e.target.value })}
                  className={selectCls}
                >
                  <option value="horizontal">Horizontal (Row)</option>
                  <option value="vertical">Vertical (Column)</option>
                </select>
              </div>
            )}
          </>
        )}

        {f.type === "text" && (
          <>
            <Num id="field-minLength" label="Min Length" value={f.minLength} onChange={(v) => up({ minLength: v })} />
            <Num id="field-maxLength" label="Max Length" value={f.maxLength} onChange={(v) => up({ maxLength: v })} />
          </>
        )}

        {f.type === "number" && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Num id="field-min" label="Min Value" value={f.min} onChange={(v) => up({ min: v })} />
              <Num id="field-max" label="Max Value" value={f.max} onChange={(v) => up({ max: v })} />
            </div>
            <Num id="field-step" label="Step" value={f.step} onChange={(v) => up({ step: v })} />
          </>
        )}

        {isChoice && (
          <>
            <Check
              id="field-multiple"
              label="Allow multiple selections"
              checked={!!f.multiple}
              onChange={(v) => up({ multiple: v })}
            />
            {f.optionsSource !== "api" && (
              <OptionsEditor options={f.options ?? []} onChange={(o) => up({ options: o })} />
            )}
          </>
        )}
      </div>

      <Footer onDuplicate={() => onDuplicate("field", f.id)} onDelete={() => onDelete("field", f.id)} />
    </div>
  );
}