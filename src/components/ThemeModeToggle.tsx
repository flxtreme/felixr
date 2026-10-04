"use client";

import { Moon, Sun } from "lucide-react";
import { useFlxTheme } from "flxtheme";
import { cln } from "@/src/utils/cln";

export function ThemeModeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useFlxTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={mode === "dark"}
      aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
      onClick={toggleMode}
      className={cln(
        "inline-flex items-center self-center rounded-full text-foreground/60 transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className
      )}
    >
      <span className="relative inline-flex h-6 w-12 items-center rounded-full border border-border p-0.5">
        <span
          className={cln(
            "flex size-5 items-center justify-center rounded-full bg-foreground text-background transition-transform",
            mode === "dark" && "translate-x-6"
          )}
        >
          {mode === "light" ? (
            <Sun aria-hidden="true" className="size-3.5" />
          ) : (
            <Moon aria-hidden="true" className="size-3.5" />
          )}
        </span>
      </span>
    </button>
  );
}
