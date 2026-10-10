"use client";

import { cln } from "@/src/utils/cln";
import type { FieldComponentProps } from "@/src/features/admin/forms/types";

export function FieldShell({
  field,
  htmlFor,
  children,
}: {
  field: FieldComponentProps["field"];
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cln("flex flex-col gap-1.5", field.outerClassName)}>
      {field.label !== undefined && field.label !== "" && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-foreground"
        >
          {field.label}
          {field.required && (
            <span className="ml-0.5 text-red-600" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {field.description && (
        <p className="text-xs text-foreground/50">{field.description}</p>
      )}
    </div>
  );
}

export const inputBase =
  "block w-full rounded-md border border-foreground/15 bg-background px-3 py-2 text-sm text-foreground " +
  "placeholder:text-foreground/35 focus:border-primary focus:outline-none focus:ring-2 " +
  "focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-foreground/10 disabled:text-foreground/50";