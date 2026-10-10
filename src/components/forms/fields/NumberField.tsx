"use client";

import { useId, useState } from "react";
import { FieldShell, inputBase } from "./FieldShell";
import type { NumberFieldConfig } from "@/src/features/admin/forms/types";
import type { FieldComponentProps } from "@/src/features/admin/forms/types";
import { cln } from "@/src/utils/cln";

export function NumberField({
  field,
  value,
  onChange,
  disabled,
  readOnly,
}: FieldComponentProps<NumberFieldConfig>) {
  const id = useId();
  const [internal, setInternal] = useState(String(field.defaultValue ?? ""));
  const current = value !== undefined ? String(value ?? "") : internal;

  return (
    <FieldShell field={field} htmlFor={id}>
      <input
        id={id}
        name={field.name ?? field.id}
        type="number"
        value={current}
        placeholder={field.placeholder}
        required={field.required}
        min={field.min}
        max={field.max}
        step={field.step}
        disabled={disabled || field.disabled}
        readOnly={readOnly || field.readonly}
        onChange={(e) => {
          setInternal(e.target.value);
          onChange?.(e.target.value === "" ? undefined : Number(e.target.value));
        }}
        className={cln(inputBase, field.innerClassName)}
      />
    </FieldShell>
  );
}