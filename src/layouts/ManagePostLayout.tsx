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
  isLoading?: boolean;
}

const Shimmer = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-foreground/8 rounded ${className}`} />
);

const EditorShimmer = () => (
  <div className="flex flex-col flex-1 h-full p-8 space-y-4">
    <Shimmer className="h-5 w-48" />
    <Shimmer className="h-4 w-full" />
    <Shimmer className="h-4 w-[92%]" />
    <Shimmer className="h-4 w-[85%]" />
    <Shimmer className="h-4 w-full" />
    <Shimmer className="h-4 w-[78%]" />
    <div className="pt-4 space-y-3">
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-[88%]" />
      <Shimmer className="h-4 w-[95%]" />
      <Shimmer className="h-4 w-[70%]" />
    </div>
    <div className="pt-4 space-y-3">
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-[82%]" />
      <Shimmer className="h-4 w-[91%]" />
    </div>
  </div>
);

const SidebarShimmer = () => (
  <div className="p-5 space-y-7">
    <div className="space-y-4">
      <Shimmer className="h-3 w-24" />
      <div className="space-y-2">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Shimmer className="h-3 w-12" />
        <Shimmer className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-20 w-full" />
      </div>
      <Shimmer className="h-10 w-full" />
    </div>
    <div className="space-y-4">
      <Shimmer className="h-3 w-28" />
      <div className="space-y-2">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-10 w-full" />
      </div>
    </div>
  </div>
);

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
        <Link
          href={backHref}
          className="text-foreground/40 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
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
            <Link
              href={backHref}
              className="flex items-center justify-center gap-1.5 border border-border text-foreground/50 hover:text-foreground text-xs font-mono font-medium px-3 py-2 rounded-sm transition-colors"
            >
              Cancel
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