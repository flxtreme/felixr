"use client";

import { useEffect, useRef, useState } from "react";
import { cln } from "@/src/utils/cln";
import type { FieldOption } from "@/src/features/admin/forms/types";

interface OptionListProps {
  id: string;
  options: FieldOption[];
  selected: string[];
  activeIndex: number;
  onPick: (o: FieldOption) => void;
  onHover: (i: number) => void;
  emptyText: string;
  loading?: boolean;
  error?: string | null;
}

export function OptionList({
  id,
  options,
  selected,
  activeIndex,
  onPick,
  onHover,
  emptyText,
  loading,
  error,
}: OptionListProps) {
  const activeRef = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex]);

  if (loading) {
    return <div className="px-3 py-2 text-sm text-foreground/50">Loading…</div>;
  }
  if (error) {
    return (
      <div role="alert" className="px-3 py-2 text-sm text-red-600">
        {error}
      </div>
    );
  }
  if (options.length === 0) {
    return <div className="px-3 py-2 text-sm text-foreground/50">{emptyText}</div>;
  }
  return (
    <ul id={id} role="listbox" className="max-h-60 overflow-auto py-1">
      {options.map((o, i) => {
        const isSel = selected.includes(o.value);
        return (
          <li
            key={o.value}
            id={`${id}-opt-${i}`}
            ref={i === activeIndex ? activeRef : undefined}
            role="option"
            aria-selected={isSel}
            aria-disabled={o.disabled || undefined}
            onMouseEnter={() => onHover(i)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => !o.disabled && onPick(o)}
            className={cln(
              "flex cursor-pointer items-start gap-2 px-3 py-2 text-sm",
              i === activeIndex && "bg-primary/10",
              o.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span className="mt-0.5 w-4 shrink-0 text-primary">
              {isSel ? "✓" : ""}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-foreground">{o.label}</span>
              {o.description && (
                <span className="block text-xs text-foreground/50">
                  {o.description}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}