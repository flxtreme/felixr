"use client";

import React from "react";
import Link from "next/link";
import { Edit2, Trash2, Plus, Tag } from "lucide-react";
import { Pagination } from "@/src/components/Pagination";
import { usePosts } from "@/src/features/admin/posts/hooks";
import { usePostContext } from "@/src/features/admin/posts/PostsContext";
import { Post } from "@/src/features/admin/posts/types";
import { AdminTable, Column } from "@/src/features/admin/components/AdminTable";

export default function PostsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { removePost } = usePostContext();
  const resolvedParams = React.use(searchParams);

  const [currentStatus, setCurrentStatus] = React.useState(
    (resolvedParams?.status ?? "published").toUpperCase()
  );
  const [currentPage, setCurrentPage] = React.useState(
    Math.max(1, Number(resolvedParams?.page) || 1)
  );
  const pageSize = 10;

  const {
    posts: paginatedPosts,
    isLoading,
    meta,
  } = usePosts({
    postType: "POST",
    status: currentStatus as Post["status"] | undefined,
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  });

  const totalPages = Math.ceil((meta?.total || 0) / pageSize) || 1;

  const columns: Column<Post>[] = [
    {
      header: "Title",
      skeletonWidth: "w-48",
      cell: (post) => (
        <div className="space-y-1">
          <Link
            href={`/admin/posts/${post.id}`}
            className="text-sm font-bold text-foreground hover:text-primary transition-colors block"
          >
            {post.title || post.slug.replace(/-/g, " ")}
          </Link>
          <div className="text-[10px] font-mono text-foreground/40 uppercase">/{post.slug}</div>
        </div>
      ),
    },
    {
      header: "Status",
      skeletonWidth: "w-20",
      cell: (post) => (
        <span
          className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-[2px] border uppercase ${
            post.status === "PUBLISHED"
              ? "border-green-500/20 bg-green-500/5 text-green-500/60"
              : post.status === "DRAFT"
                ? "border-blue-500/20 bg-blue-500/5 text-blue-500/60"
                : "border-red-500/20 bg-red-500/5 text-red-500/60"
          }`}
        >
          {post.status}
        </span>
      ),
    },
    {
      header: "Tags",
      skeletonWidth: "w-32",
      cell: (post) => (
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-foreground/40 uppercase">
          <Tag className="w-3 h-3 text-foreground/20" />
          <span>{(post.metadata?.tags as string[])?.join(", ") || "NO TAGS"}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      skeletonWidth: "w-16",
      cell: (post) => (
        <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/admin/posts/${post.id}`}
            className="text-foreground/40 hover:text-primary transition-colors"
            aria-label="Edit post"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              if (window.confirm("Delete this post?")) removePost(post.id);
            }}
            className="text-foreground/40 hover:text-red-500 transition-colors"
            aria-label="Delete post"
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
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-sm font-mono font-medium text-foreground/40">
            Manage your blog posts and articles
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="text-primary hover:underline text-sm font-medium flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Post
        </Link>
      </header>

      <div className="flex items-center gap-6 border-b border-border">
        {["PUBLISHED", "DRAFT", "TRASHED"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setCurrentStatus(s);
              setCurrentPage(1);
            }}
            className={`pb-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              currentStatus === s
                ? "border-primary text-primary"
                : "border-transparent text-foreground/40 hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <AdminTable
        columns={columns}
        data={paginatedPosts}
        isLoading={isLoading}
        emptyMessage="No posts found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/admin/posts?status=${currentStatus.toLowerCase()}`}
      />
    </div>
  );
}