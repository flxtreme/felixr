"use client";

import React from "react";
import { builtInFieldDefinitions } from "@/src/features/admin/forms/types";
import type { FieldDefinition } from "@/src/features/admin/forms/types";

export const PALETTE_FIELD_MIME = "application/x-form-palette-field";

interface FormBuilderToolbarProps {
  onAddField: (def: FieldDefinition) => void;
}

export function FormBuilderToolbar({ onAddField }: FormBuilderToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Form builder toolbar"
      className="flex flex-col items-center gap-y-2 w-full"
    >
      <div className="grid grid-cols-2 gap-2 w-full">
        {builtInFieldDefinitions.map((def) => (
          <div
            className="w-full flex flex-col items-center justify-center gap-2 p-3 text-center border rounded-md border-dashed border-border hover:border-primary/45 hover:bg-surface/35 cursor-pointer transition-colors select-none"
            key={String(def.type)}
            draggable
            onClick={() => onAddField(def)}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "copyMove";
              e.dataTransfer.setData("text/plain", `palette:${def.type}`);
              e.dataTransfer.setData(PALETTE_FIELD_MIME, String(def.type));
            }}
          >
            <div className="text-foreground/70">{def.icon}</div>
            <span className="text-xs font-mono font-medium">{def.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}