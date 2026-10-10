"use client";

import { useId, useState } from "react";
import { FieldShell, inputBase } from "./FieldShell";
import type { TextFieldConfig } from "@/src/features/admin/forms/types";
import type { FieldComponentProps } from "@/src/features/admin/forms/types";
import { cln } from "@/src/utils/cln";

export function TextField({
  field,
  value,
  onChange,
  disabled,
  readOnly,
}: FieldComponentProps<TextFieldConfig>) {
  const id = useId();
  const [internal, setInternal] = useState(String(field.defaultValue ?? ""));
  const current = value !== undefined ? String(value) : internal;

  return (
    <FieldShell field={field} htmlFor={id}>
      <input
        id={id}
        name={field.name ?? field.id}
        type="text"
        value={current}
        placeholder={field.placeholder}
        required={field.required}
        minLength={field.minLength}
        maxLength={field.maxLength}
        pattern={field.pattern}
        disabled={disabled || field.disabled}
        readOnly={readOnly || field.readonly}
        onChange={(e) => {
          setInternal(e.target.value);
          onChange?.(e.target.value);
        }}
        className={cln(inputBase, field.innerClassName)}
      />
    </FieldShell>
  );
}