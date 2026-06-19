"use client";

import React from "react";
import Link from "next/link";
import { Edit2, Trash2, Plus, EyeOff } from "lucide-react";
import { Pagination } from "@/src/components/Pagination";
import { useTagsContext } from "@/src/features/admin/tags/TagsContext";
import { AdminTable, Column } from "@/src/features/admin/components/AdminTable";
import { Tag } from "@/src/features/admin/tags/types";
import { Button } from "@/src/components/Button";

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
        <div className="flex items-center justify-end gap-2 text-xs font-mono font-medium text-foreground/40">
          <Link
            href={`/admin/tags/${tag.id}`}
            className="hover:text-primary hover:underline transition-colors"
          >
            Edit
          </Link>
          <span className="text-foreground/20">|</span>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this tag?")) {
                removeTag(tag.id, { isPermanent: false });
              }
            }}
            className="hover:text-red-500 hover:underline transition-colors"
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Tags</h1>
          <p className="text-sm font-mono font-medium text-foreground/40">
            Manage Content Classification and Keywords
          </p>
        </div>
        <Link
          href="/admin/tags/new"
        >
          <Button
            variant="primary"
            size="sm"
          >
            <span>Create Tag</span>
            <Plus className="size-4 ml-2" />
          </Button>
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
