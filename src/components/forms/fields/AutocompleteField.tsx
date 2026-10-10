"use client";

import { useId, useRef, useState, useCallback, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { cln } from "@/src/utils/cln";
import { FieldShell, inputBase } from "./FieldShell";
import { OptionList } from "./OptionList";
import { useRemoteOptions, nextEnabled, toSelectedArray, useOutsideClose } from "./useRemoteOptions";
import { useDebounced } from "./useDebounced";
import type { AutocompleteFieldConfig } from "@/src/features/admin/forms/types";
import type { FieldComponentProps } from "@/src/features/admin/forms/types";

export function AutocompleteField({
  field,
  value,
  onChange,
  disabled,
  readOnly,
}: FieldComponentProps<AutocompleteFieldConfig>) {
  const id = useId();
  const listId = `${id}-list`;
  const multiple = !!field.multiple;
  const minLen = field.minSearchLength ?? 0;
  const api =
    field.optionsSource === "api" && field.api?.endpoint ? field.api : undefined;
  const serverSearch = !!api?.searchParam;
  const rootRef = useRef<HTMLDivElement>(null);
  const labels = useRef(new Map<string, string>());
  const [internal, setInternal] = useState<unknown>(field.defaultValue);
  const current = value !== undefined ? value : internal;
  const selected = toSelectedArray(current, multiple);

  const [query, setQuery] = useState(() => {
    if (multiple || !selected[0]) return "";
    return (field.options ?? []).find((o) => o.value === selected[0])?.label ?? selected[0];
  });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounced(query, field.debounceMs ?? 0);
  const tooShort = debounced.trim().length < minLen;

  const remote = useRemoteOptions(api, debounced.trim(), open && !tooShort);
  const options = api ? remote.options : field.options ?? [];
  options.forEach((o) => labels.current.set(o.value, o.label));
  const labelFor = (v: string) => labels.current.get(v) ?? v;

  const isDisabled = !!(disabled || field.disabled);
  const isReadOnly = !!(readOnly || field.readonly);

  const close = useCallback(() => {
    setOpen(false);
    setActive(-1);
  }, []);
  useOutsideClose(rootRef, open, close);

  const filtered = useMemo(() => {
    if (tooShort) return [];
    if (serverSearch) return options;
    const q = debounced.trim().toLowerCase();
    return options.filter((o) => !q || o.label.toLowerCase().includes(q));
  }, [options, debounced, tooShort, serverSearch]);

  const emit = (next: string[]) => {
    const out = multiple ? next : next[0];
    setInternal(out);
    onChange?.(out);
  };

  const pick = (o: { value: string; label: string; disabled?: boolean }) => {
    if (o.disabled) return;
    labels.current.set(o.value, o.label);
    if (multiple) {
      emit(
        selected.includes(o.value)
          ? selected.filter((v) => v !== o.value)
          : [...selected, o.value]
      );
      setQuery("");
    } else {
      emit([o.value]);
      setQuery(o.label);
      close();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled || isReadOnly) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((a) => nextEnabled(filtered, a, e.key === "ArrowDown" ? 1 : -1));
    } else if (e.key === "Enter") {
      if (open && active >= 0 && filtered[active]) {
        e.preventDefault();
        pick(filtered[active]);
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    } else if (e.key === "Backspace" && multiple && !query && selected.length) {
      emit(selected.slice(0, -1));
    }
  };

  const canClear =
    !!field.clearable &&
    (selected.length > 0 || query) &&
    !isDisabled &&
    !isReadOnly;

  return (
    <FieldShell field={field} htmlFor={id}>
      <div ref={rootRef} className="relative">
        <div
          className={cln(
            inputBase,
            "flex flex-wrap items-center gap-1.5 py-1.5",
            canClear && "pr-8",
            field.innerClassName
          )}
        >
          {multiple &&
            selected.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
              >
                {labelFor(v)}
                {!isDisabled && !isReadOnly && (
                  <button
                    type="button"
                    aria-label={`Remove ${labelFor(v)}`}
                    onClick={() => emit(selected.filter((s) => s !== v))}
                    className="text-primary hover:text-primary/70"
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            ))}
          <input
            id={id}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-required={field.required}
            aria-activedescendant={
              open && active >= 0 ? `${listId}-opt-${active}` : undefined
            }
            value={query}
            placeholder={selected.length && multiple ? "" : field.placeholder}
            disabled={isDisabled}
            readOnly={isReadOnly}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => !isReadOnly && setOpen(true)}
            onKeyDown={onKeyDown}
            className="min-w-[6rem] flex-1 bg-transparent py-0.5 text-sm outline-none placeholder:text-foreground/35"
          />
        </div>
        {canClear && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              emit([]);
              setQuery("");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-foreground/40 hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
        {open && (
          <div className="absolute z-30 mt-1 w-full rounded-md border border-foreground/15 bg-background shadow-lg">
            {tooShort ? (
              <div className="px-3 py-2 text-sm text-foreground/50">
                Type at least {minLen} character{minLen === 1 ? "" : "s"} to search
              </div>
            ) : (
              <OptionList
                id={listId}
                options={filtered}
                selected={selected}
                activeIndex={active}
                onPick={pick}
                onHover={setActive}
                loading={api ? remote.loading : false}
                error={api ? remote.error : null}
                emptyText="No results"
              />
            )}
          </div>
        )}
      </div>
    </FieldShell>
  );
}