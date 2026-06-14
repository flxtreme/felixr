"use client";

export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { Edit2, Trash2, Plus, Tag } from "lucide-react";
import { Pagination } from "@/src/components/Pagination";
import { usePosts } from "@/src/features/admin/posts/hooks";
import { usePagesContext } from "@/src/features/admin/pages/PagesContext";
import { Post } from "@/src/features/admin/posts/types";
import { AdminTable, Column } from "@/src/features/admin/components/AdminTable";

export default function PagesListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { removePage } = usePagesContext();
  const resolvedParams = React.use(searchParams);
  const page = resolvedParams?.page;
  const status = resolvedParams?.status ?? "published";
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 10;
  const currentStatus = status.toUpperCase();

  const {
    posts: paginatedPages,
    isLoading,
    meta,
  } = usePosts({
    postType: "PAGE",
    status: currentStatus as Post["status"] | undefined,
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  });

  const totalPages = Math.ceil((meta?.total || 0) / pageSize) || 1;

  const columns: Column<Post>[] = [
    {
      header: "Title",
      skeletonWidth: "w-48",
      cell: (page) => (
        <div className="space-y-1">
          <Link
            href={`/admin/pages/${page.id}`}
            className="text-sm font-bold text-foreground hover:text-primary transition-colors block"
          >
            {page.title || page.slug.replace(/-/g, " ")}
          </Link>
          <div className="text-[10px] font-mono text-foreground/40 uppercase">/{page.slug}</div>
        </div>
      ),
    },
    {
      header: "Status",
      skeletonWidth: "w-20",
      cell: (page) => (
        <span
          className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-[2px] border uppercase ${
            page.status === "PUBLISHED"
              ? "border-green-500/20 bg-green-500/5 text-green-500/60"
              : page.status === "DRAFT"
                ? "border-blue-500/20 bg-blue-500/5 text-blue-500/60"
                : "border-red-500/20 bg-red-500/5 text-red-500/60"
          }`}
        >
          {page.status}
        </span>
      ),
    },
    {
      header: "Tags",
      skeletonWidth: "w-32",
      cell: (page) => (
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-foreground/40 uppercase">
          <Tag className="w-3 h-3 text-foreground/20" />
          <span>{(page.metadata?.tags as string[])?.join(", ") || "NO TAGS"}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      skeletonWidth: "w-16",
      cell: (page) => (
        <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/admin/pages/${page.id}`}
            className="text-foreground/40 hover:text-primary transition-colors"
            aria-label="Edit page"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              if (window.confirm("Delete this page?")) removePage(page.id);
            }}
            className="text-foreground/40 hover:text-red-500 transition-colors"
            aria-label="Delete page"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-sm font-mono font-medium text-foreground/40">
            Manage your static pages
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="text-primary hover:underline text-sm font-medium flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Page
        </Link>
      </header>

      <div className="flex items-center gap-6 border-b border-border">
        {["PUBLISHED", "DRAFT", "TRASHED"].map((s) => (
          <Link
            key={s}
            href={{
              pathname: "/admin/pages",
              query: { status: s.toLowerCase() },
            }}
            className={`pb-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              currentStatus === s
                ? "border-primary text-primary"
                : "border-transparent text-foreground/40 hover:text-foreground"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <AdminTable
        columns={columns}
        data={paginatedPages}
        isLoading={isLoading}
        emptyMessage="No pages found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/admin/pages?status=${currentStatus.toLowerCase()}`}
      />
    </div>
  );
}