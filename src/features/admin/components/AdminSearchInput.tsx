import { Search } from "lucide-react";
import { cln } from "@/src/utils/cln";

export function AdminSearchInput({
  value,
  onChange,
  label,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={cln("flex min-w-0 flex-1 items-center gap-2 border border-foreground/15 bg-background/30 px-3 py-2", className)}>
      <Search aria-hidden="true" className="size-4 shrink-0 text-foreground/40" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 w-full flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/35"
      />
    </label>
  );
}
