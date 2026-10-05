"use client";

import { Save } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import Shimmer from "@/src/components/shimmer/Shimmer";
import { EditorShimmer, SidebarShimmer } from "@/src/components/shimmer/EditorShimmer";
import { AdminButton } from "@/src/features/admin/components/AdminButton";

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

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
        <main className="flex min-h-[50vh] w-full flex-col overflow-y-auto border-b border-border md:min-h-0 md:w-[70%] md:border-b-0 md:border-r">
          {isLoading ? <EditorShimmer /> : editor}
        </main>

        <aside className="flex max-h-[45vh] w-full shrink-0 flex-col overflow-hidden md:max-h-none md:w-[30%]">
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {isLoading ? <SidebarShimmer /> : sidebar}
          </div>

          <div className="shrink-0 border-t border-border px-5 py-3 flex items-center gap-3 bg-background">
            <Link href={backHref}>
              <AdminButton variant="ghost">Cancel</AdminButton>
            </Link>
            <AdminButton
              variant="primary"
              size="sm"
              onClick={onSave}
              disabled={isLoading}
              className="flex-1"
            >
              <Save className="w-3.5 h-3.5" />
              {saveLabel}
            </AdminButton>
          </div>
        </aside>
      </div>
    </div>
  );
}
