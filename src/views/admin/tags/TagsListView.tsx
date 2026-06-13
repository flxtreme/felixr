"use client";

import React from "react";
import Link from "next/link";
import { Edit2, Trash2, Plus, EyeOff } from "lucide-react";
import { Pagination } from "@/src/components/Pagination";
import { useTagsContext } from "@/src/features/admin/tags/TagsContext";
import { AdminTable, Column } from "@/src/features/admin/components/AdminTable";
import { Tag } from "@/src/features/admin/tags/types";

export default function TagsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { tags, isLoading, removeTag } = useTagsContext();
  const { page } = React.use(searchParams);

  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 10;
  const totalPages = Math.ceil(tags.length / pageSize);
  const paginatedTags = tags.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<Tag>[] = [
    {
      header: "Name",
      skeletonWidth: "w-32",
      cell: (tag) => <span className="text-sm font-medium">{tag.name}</span>,
    },
    {
      header: "Slug",
      skeletonWidth: "w-40",
      cell: (tag) => (
        <span className="text-sm font-mono font-medium text-foreground/40">{tag.slug}</span>
      ),
    },
    {
      header: "Tagged",
      skeletonWidth: "w-12",
      cell: (tag) => <span className="text-sm font-bold text-foreground/40">{tag.count ?? 0}</span>,
    },
    {
      header: "Status",
      skeletonWidth: "w-24",
      cell: (tag) =>
        tag.excludeFromPages ? (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-500/60 uppercase px-2 py-0.5 border border-red-500/20 bg-red-500/5 rounded">
            <EyeOff className="w-3 h-3" /> Excluded
          </span>
        ) : (
          <span className="inline-flex items-center text-[10px] font-mono font-bold text-emerald-500/60 uppercase px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/5 rounded">
            Public
          </span>
        ),
    },
    {
      header: "Created At",
      skeletonWidth: "w-24",
      cell: (tag) => (
        <span className="text-xs font-mono font-medium text-foreground/40">
          {new Date(tag.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      skeletonWidth: "w-16",
      cell: (tag) => (
        <div className="flex items-center justify-end gap-4">
          <Link
            href={`/admin/tags/${tag.id}`}
            className="text-foreground/40 hover:text-primary transition-colors"
            aria-label="Edit tag"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this tag?")) {
                removeTag(tag.id, { isPermanent: false });
              }
            }}
            className="text-foreground/40 hover:text-red-500 transition-colors"
            aria-label="Delete tag"
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
          <h1 className="text-2xl font-bold">Tags</h1>
          <p className="text-sm font-mono font-medium text-foreground/40">
            Manage Content Classification and Keywords
          </p>
        </div>
        <Link
          href="/admin/tags/new"
          className="text-primary hover:underline text-sm font-medium flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Tag
        </Link>
      </header>

      <AdminTable
        columns={columns}
        data={paginatedTags}
        isLoading={isLoading}
        emptyMessage="No tags found."
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/tags" />
    </div>
  );
}
