"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { PanelRight, X } from "lucide-react";
import { cln } from "@/src/utils/cln";

export function AdminMobilePanel({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open admin tools"
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-40 inline-flex size-12 items-center justify-center rounded-full border border-foreground/10 bg-primary text-white shadow-xl transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <PanelRight aria-hidden="true" className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Close admin tools"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
        className={cln("fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Admin tools"
        aria-hidden={!open}
        inert={!open}
        className={cln("fixed inset-x-3 bottom-3 z-50 max-h-[min(75dvh,44rem)] overflow-y-auto rounded-2xl border border-foreground/10 bg-background/95 shadow-2xl backdrop-blur-md transition-[transform,opacity,visibility] duration-300 ease-out", open ? "visible translate-y-0 opacity-100" : "invisible translate-y-[calc(100%+1rem)] opacity-0")}
      >
        <header className="sticky top-0 flex items-center justify-between border-b border-foreground/10 bg-background/95 px-5 py-3 backdrop-blur-md">
          <h2 className="text-sm font-bold lowercase text-foreground/75">tools</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close admin tools" className="inline-flex size-8 items-center justify-center text-foreground/55 hover:text-primary">
            <X aria-hidden="true" className="size-4" />
          </button>
        </header>
        <div className="max-h-[calc(75dvh-3.5rem)] overflow-y-auto">{children}</div>
      </section>
    </div>
  );
}
