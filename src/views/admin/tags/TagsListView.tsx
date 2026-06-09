"use client";

import React from "react";
import { use } from "react";
import Link from "next/link";
import { Edit2, Trash2, Plus, EyeOff } from "lucide-react";
import { Pagination } from "@/src/components/Pagination";
import { useTagsContext } from "@/src/features/admin/tags/TagsContext";

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

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm font-mono text-foreground/40 animate-pulse">Loading tags...</p>
        </div>
      )}

      {!isLoading && tags.length === 0 && (
        <div className="flex items-center justify-center py-12 border border-dashed border-border">
          <p className="text-sm font-mono text-foreground/40">No tags found.</p>
        </div>
      )}

      <div className="border border-border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-sm font-mono font-medium text-foreground/40">Name</th>
              <th className="px-6 py-3 text-sm font-mono font-medium text-foreground/40">Slug</th>
              <th className="px-6 py-3 text-sm font-mono font-medium text-foreground/40">Tagged</th>
              <th className="px-6 py-3 text-sm font-mono font-medium text-foreground/40">Status</th>
              <th className="px-6 py-3 text-sm font-mono font-medium text-foreground/40">Created At</th>
              <th className="px-6 py-3 text-sm font-mono font-medium text-foreground/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!isLoading && paginatedTags.map((tag) => (
              <tr key={tag.id} className="group transition-colors">
                <td className="px-6 py-2">
                  <span className="text-sm font-medium">{tag.name}</span>
                </td>
                <td className="px-6 py-2">
                  <span className="text-sm font-mono font-medium text-foreground/40">{tag.slug}</span>
                </td>
                <td className="px-6 py-2">
                  <span className="text-sm font-bold text-foreground/40">{tag.count ?? 0}</span>
                </td>
                <td className="px-6 py-2">
                  {tag.excludeFromPages ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-500/60 uppercase px-2 py-0.5 border border-red-500/20 bg-red-500/5 rounded">
                      <EyeOff className="w-3 h-3" /> Excluded
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-mono font-bold text-emerald-500/60 uppercase px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/5 rounded">Public</span>
                  )}
                </td>
                <td className="px-6 py-2 text-xs font-mono font-medium text-foreground/40">
                  {new Date(tag.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/admin/tags"
      />
    </div>
  );
}