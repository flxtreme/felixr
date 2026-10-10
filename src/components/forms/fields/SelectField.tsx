"use client";

import { useId, useRef, useState, useCallback, useMemo, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { cln } from "@/src/utils/cln";
import { FieldShell, inputBase } from "./FieldShell";
import { OptionList } from "./OptionList";
import { useRemoteOptions, nextEnabled, toSelectedArray, useOutsideClose } from "./useRemoteOptions";
import { useDebounced } from "./useDebounced";
import type { SelectFieldConfig } from "@/src/features/admin/forms/types";
import type { FieldComponentProps } from "@/src/features/admin/forms/types";

export function SelectField({
  field,
  value,
  onChange,
  disabled,
  readOnly,
}: FieldComponentProps<SelectFieldConfig>) {
  const id = useId();
  const listId = `${id}-list`;
  const multiple = !!field.multiple;
  const api =
    field.optionsSource === "api" && field.api?.endpoint ? field.api : undefined;
  const serverSearch = !!api?.searchParam;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const labels = useRef(new Map<string, string>());
  const [internal, setInternal] = useState<unknown>(field.defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);

  const debouncedQuery = useDebounced(query, serverSearch ? 300 : 0);
  const remote = useRemoteOptions(
    api,
    field.searchable ? debouncedQuery.trim() : "",
    open
  );
  const options = api ? remote.options : field.options ?? [];
  options.forEach((o) => labels.current.set(o.value, o.label));

  const isDisabled = !!(disabled || field.disabled);
  const isReadOnly = !!(readOnly || field.readonly);
  const current = value !== undefined ? value : internal;
  const selected = toSelectedArray(current, multiple);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (serverSearch || !field.searchable || !q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, field.searchable, serverSearch]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(-1);
  }, []);
  useOutsideClose(rootRef, open, close);

  useEffect(() => {
    if (open && field.searchable) searchRef.current?.focus();
  }, [open, field.searchable]);

  const emit = (next: string[]) => {
    const out = multiple ? next : next[0];
    setInternal(out);
    onChange?.(out);
  };

  const pick = (o: { value: string; label: string; disabled?: boolean }) => {
    if (o.disabled) return;
    labels.current.set(o.value, o.label);
    if (multiple) {
      if (selected.includes(o.value)) {
        emit(selected.filter((v) => v !== o.value));
      } else {
        if (field.maxSelections && selected.length >= field.maxSelections) return;
        emit([...selected, o.value]);
      }
    } else {
      emit([o.value]);
    }
    if (field.closeOnSelect ?? !multiple) {
      close();
      triggerRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled || isReadOnly) return;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setActive(nextEnabled(filtered, -1, 1));
        } else {
          setActive((a) => nextEnabled(filtered, a, e.key === "ArrowDown" ? 1 : -1));
        }
        break;
      }
      case "Home":
      case "End": {
        if (!open) break;
        if (e.target === searchRef.current) break;
        e.preventDefault();
        setActive(
          e.key === "Home"
            ? nextEnabled(filtered, -1, 1)
            : nextEnabled(filtered, 0, -1)
        );
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (!open) setOpen(true);
        else if (active >= 0 && filtered[active]) pick(filtered[active]);
        break;
      }
      case "Escape": {
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          close();
          triggerRef.current?.focus();
        }
        break;
      }
    }
  };

  const labelFor = (v: string) => labels.current.get(v) ?? v;
  const display =
    selected.length === 0
      ? null
      : multiple
      ? selected.map(labelFor).join(", ")
      : labelFor(selected[0]);
  const canClear =
    !!field.clearable && selected.length > 0 && !isDisabled && !isReadOnly;

  return (
    <FieldShell field={field} htmlFor={id}>
      <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
        <button
          ref={triggerRef}
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-required={field.required}
          aria-activedescendant={
            open && active >= 0 ? `${listId}-opt-${active}` : undefined
          }
          disabled={isDisabled}
          onClick={() => !isReadOnly && (open ? close() : setOpen(true))}
          className={cln(
            inputBase,
            "flex items-center justify-between gap-2 text-left",
            canClear && "pr-14",
            field.innerClassName
          )}
        >
          <span className={cln("truncate", !display && "text-foreground/40")}>
            {display ?? field.placeholder ?? "Select…"}
          </span>
          <span aria-hidden="true" className="text-foreground/40">
            <ChevronDown size={16} />
          </span>
        </button>
        {canClear && (
          <button
            type="button"
            aria-label="Clear selection"
            onClick={() => emit([])}
            className="absolute right-8 top-1/2 -translate-y-1/2 rounded px-1 text-foreground/40 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <X size={14} />
          </button>
        )}
        {open && (
          <div className="absolute z-30 mt-1 w-full rounded-md border border-foreground/15 bg-background shadow-lg">
            {field.searchable && (
              <div className="border-b border-foreground/10 p-2">
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  aria-label="Search options"
                  placeholder="Search…"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(-1);
                  }}
                  className={cln(inputBase, "py-1.5")}
                />
              </div>
            )}
            <OptionList
              id={listId}
              options={filtered}
              selected={selected}
              activeIndex={active}
              onPick={pick}
              onHover={setActive}
              loading={api ? remote.loading : false}
              error={api ? remote.error : null}
              emptyText={
                !api && options.length === 0 ? "No options configured" : "No results"
              }
            />
          </div>
        )}
      </div>
    </FieldShell>
  );
}