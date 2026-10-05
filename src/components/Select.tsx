"use client";

import { Children, isValidElement, useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, ReactNode, SelectHTMLAttributes } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cln } from "@/src/utils/cln";

type OptionProps = { value?: string; disabled?: boolean; children?: ReactNode };
type SelectChangeEvent = Pick<ChangeEvent<HTMLSelectElement>, "target">;

export function Select({
  value = "",
  onChange,
  children,
  className,
  containerClassName,
  disabled,
  required,
  name,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: Pick<SelectHTMLAttributes<HTMLSelectElement>, "value" | "className" | "disabled" | "required" | "name" | "id" | "aria-label" | "aria-labelledby"> & {
  onChange?: (event: SelectChangeEvent) => void;
  children: ReactNode;
  containerClassName?: string;
}) {
  const generatedId = useId();
  const listboxId = id ?? `select-${generatedId}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const [openAbove, setOpenAbove] = useState(false);
  const options = Children.toArray(children).flatMap((child) => {
    if (!isValidElement<OptionProps>(child) || child.type !== "option") return [];
    const optionValue = child.props.value ?? String(child.props.children ?? "");
    return [{ value: optionValue, label: child.props.children, disabled: child.props.disabled ?? false }];
  });
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open || !triggerRef.current || !listboxRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const listboxRect = listboxRef.current.getBoundingClientRect();
    setAlignRight(triggerRect.left + listboxRect.width > window.innerWidth - 8);
    setOpenAbove(triggerRect.bottom + listboxRect.height > window.innerHeight - 8 && triggerRect.top > listboxRect.height);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const focusOption = (index: number) => {
    const enabled = options.map((option, optionIndex) => ({ option, optionIndex })).filter(({ option }) => !option.disabled);
    if (!enabled.length) return;
    const next = enabled.find(({ optionIndex }) => optionIndex === index) ?? enabled[0];
    optionRefs.current[next.optionIndex]?.focus();
  };

  const change = (nextValue: string) => {
    onChange?.({ target: { value: nextValue } as HTMLSelectElement });
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={rootRef} className={cln("relative w-full", containerClassName)}>
      {name && <input type="hidden" name={name} value={value} required={required} disabled={disabled} />}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => focusOption(selectedIndex));
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((current) => !current);
            if (!open) requestAnimationFrame(() => focusOption(selectedIndex));
          }
        }}
        className={cln(
          "flex min-h-10 items-center justify-between gap-3 border border-foreground/15 bg-transparent px-3 py-2 text-left text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
      >
        <span className={cln("min-w-0 flex-1 truncate", !selectedOption && "text-foreground/40")}>
          {selectedOption?.label ?? "Select an option"}
        </span>
        <ChevronDown aria-hidden="true" className={cln("size-4 shrink-0 text-foreground/45 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel ?? "Options"}
          className={cln(
            "absolute z-50 max-h-64 w-max min-w-full max-w-[calc(100vw-1rem)] overflow-y-auto border border-foreground/15 bg-background p-1 shadow-xl",
            openAbove ? "bottom-full mb-1" : "top-full mt-1",
            alignRight ? "right-0" : "left-0",
          )}
        >
          {options.map((option, index) => (
            <div
              key={`${option.value}-${index}`}
              ref={(element) => { optionRefs.current[index] = element; }}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              tabIndex={option.disabled ? -1 : 0}
              onClick={() => { if (!option.disabled) change(option.value); }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  const direction = event.key === "ArrowDown" ? 1 : -1;
                  focusOption((index + direction + options.length) % options.length);
                } else if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  if (!option.disabled) change(option.value);
                } else if (event.key === "Escape") {
                  setOpen(false);
                  triggerRef.current?.focus();
                } else if (event.key === "Tab") {
                  setOpen(false);
                }
              }}
              className={cln(
                "flex min-h-9 cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm text-foreground/75 outline-none transition-colors hover:bg-foreground/5 focus:bg-foreground/5",
                option.value === value && "text-primary",
                option.disabled && "pointer-events-none opacity-40",
              )}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && <Check aria-hidden="true" className="size-4 shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
