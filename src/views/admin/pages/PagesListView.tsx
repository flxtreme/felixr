"use client";

import React from "react";
import Link from "next/link";
import { Edit2, Trash2, Plus, Tag } from "lucide-react";
import { Pagination } from "@/src/components/Pagination";
import { usePosts } from "@/src/features/admin/posts/hooks";
import { usePagesContext } from "@/src/features/admin/pages/PagesContext";
import { Post } from "@/src/features/admin/posts/types";

export default function PagesListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { removePage } = usePagesContext();
  const { page, status } = React.use(searchParams);
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 10;
  const currentStatus = (status || "ALL").toUpperCase();

  const { posts: paginatedPages, isLoading, meta } = usePosts({ 
    postType: "PAGE", 
    status: currentStatus === "ALL" ? undefined : (currentStatus as any),
    offset: (currentPage - 1) * pageSize,
    limit: pageSize 
  });

  const totalPages = Math.ceil((meta?.total || 0) / pageSize) || 1;

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
        {["ALL", "PUBLISHED", "DRAFT", "TRASHED"].map((s) => (
          <Link
            key={s}
            href={{
              pathname: "/admin/pages",
              query: s === "ALL" ? {} : { status: s.toLowerCase() },
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

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm font-mono text-foreground/40 animate-pulse">Loading pages...</p>
        </div>
      )}

      <div className="border border-border">
        <div className="divide-y divide-border">
          {paginatedPages.map((post: Post) => (
            <div key={post.id} className="group p-6 hover:bg-foreground/[0.02] transition-colors relative">
              <div className="space-y-3">
                {/* Row 1: Title */}
                <div className="pr-32">
                  <Link 
                    href={`/admin/pages/${post.id}`}
                    className="text-base font-bold text-foreground hover:text-primary transition-colors block"
                  >
                    {post.title || post.slug.replace(/-/g, ' ')}
                  </Link>
                </div>

                {/* Row 2: Slug, Status, Tags */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-mono font-bold uppercase tracking-wider text-foreground/40">
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground/20">/</span> {post.slug}
                  </div>
                  <div className={`px-2 py-0.5 rounded-[2px] border ${
                    post.status === 'PUBLISHED' ? 'border-green-500/20 bg-green-500/5 text-green-500/60' :
                    post.status === 'DRAFT' ? 'border-blue-500/20 bg-blue-500/5 text-blue-500/60' :
                    'border-red-500/20 bg-red-500/5 text-red-500/60'
                  }`}>
                    {post.status}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-foreground/20" />
                    <span>{(post.metadata?.tags as string[])?.join(", ") || "NO TAGS"}</span>
                  </div>
                </div>
              </div>

              {/* Actions Area */}
              <div className="absolute top-1/2 -translate-y-1/2 right-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/admin/pages/${post.id}`}
                  className="text-foreground/40 hover:text-primary transition-colors"
                  aria-label="Edit page"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm("Delete this page?")) removePage(post.id);
                  }}
                  className="text-foreground/40 hover:text-red-500 transition-colors"
                  aria-label="Delete page"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/admin/pages${currentStatus !== "ALL" ? `?status=${currentStatus.toLowerCase()}` : ""}`}
      />
    </div>
  );
}