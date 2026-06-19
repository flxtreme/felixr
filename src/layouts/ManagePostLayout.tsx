"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import Shimmer from "@/src/components/shimmer/Shimmer";
import { EditorShimmer, SidebarShimmer } from "@/src/components/shimmer/EditorShimmer";
import { Button } from "@/src/components/Button";

interface ManagePostLayoutProps {
  pageTitle: string;
  backHref: string;
  saveLabel?: string;
  onSave: () => void;
  editor: ReactNode;
  sidebar: ReactNode;
  isLoading?: boolean;
}

export function ManagePostLayout({
  pageTitle,
  backHref,
  saveLabel = "Save Post",
  onSave,
  editor,
  sidebar,
  isLoading = false,
}: ManagePostLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <header className="h-12 border-b border-border flex items-center px-6 gap-3 shrink-0 bg-background z-10">
        {isLoading ? (
          <Shimmer className="h-4 w-40" />
        ) : (
          <h1 className="text-sm font-bold">{pageTitle}</h1>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="w-[70%] border-r border-border overflow-y-auto flex flex-col">
          {isLoading ? <EditorShimmer /> : editor}
        </main>

        <aside className="w-[30%] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5">
            {isLoading ? <SidebarShimmer /> : sidebar}
          </div>

          <div className="shrink-0 border-t border-border px-5 py-3 flex items-center gap-3 bg-background">
            <Link href={backHref}>
              <Button variant="tertiary" size="sm">Cancel</Button>
            </Link>
            <button
              type="button"
              onClick={onSave}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-mono font-medium px-3 py-2 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
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