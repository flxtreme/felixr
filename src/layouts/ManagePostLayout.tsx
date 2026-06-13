"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ManagePostLayoutProps {
  pageTitle: string;
  backHref: string;
  saveLabel?: string;
  onSave: () => void;
  editor: ReactNode;
  sidebar: ReactNode;
}

export function ManagePostLayout({
  pageTitle,
  backHref,
  saveLabel = "Save Post",
  onSave,
  editor,
  sidebar,
}: ManagePostLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <header className="h-12 border-b border-border flex items-center px-6 gap-3 shrink-0 bg-background z-10">
        <Link
          href={backHref}
          className="text-foreground/40 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-sm font-bold">{pageTitle}</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="w-[70%] border-r border-border overflow-y-auto flex flex-col">
          {editor}
        </main>

        <aside className="w-[30%] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5">{sidebar}</div>

          <div className="shrink-0 border-t border-border px-5 py-3 flex items-center gap-3 bg-background">
            <Link
              href={backHref}
              className="flex items-center justify-center gap-1.5 border border-border text-foreground/50 hover:text-foreground text-xs font-mono font-medium px-3 py-2 rounded-sm transition-colors"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={onSave}
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-mono font-medium px-3 py-2 rounded-sm hover:opacity-90 transition-opacity"
            >
              <Save className="w-3.5 h-3.5" />
              {saveLabel}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
