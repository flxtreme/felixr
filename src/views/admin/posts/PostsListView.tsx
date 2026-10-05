"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus } from "flxtheme/icons/fi";
import { Pagination, Tabs, TabsList, TabsTrigger } from "flxtheme";
import { usePosts } from "@/src/features/admin/posts/hooks";
import { usePostContext } from "@/src/features/admin/posts/PostsContext";
import type { Post } from "@/src/features/admin/posts/types";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { AdminList, type AdminListColumn } from "@/src/features/admin/components/AdminList";
import { AdminPageHeader } from "@/src/features/admin/components/AdminPageHeader";
import { AdminRowActions } from "@/src/features/admin/components/AdminRowActions";
import { AdminSearchInput } from "@/src/features/admin/components/AdminSearchInput";

export default function PostsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const { removePost } = usePostContext();
  const resolvedParams = React.use(searchParams);

  const [currentStatus, setCurrentStatus] = useState(
    (resolvedParams?.status ?? "published").toUpperCase()
  );
  const [currentPage, setCurrentPage] = useState(
    Math.max(1, Number(resolvedParams?.page) || 1)
  );
  const [search, setSearch] = useState(resolvedParams?.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());
  const pageSize = 10;

  useEffect(() => {
    setSearch(resolvedParams?.search ?? "");
    setCurrentStatus((resolvedParams?.status ?? "published").toUpperCase());
    setCurrentPage(Math.max(1, Number(resolvedParams?.page) || 1));
  }, [resolvedParams?.page, resolvedParams?.status, resolvedParams?.search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const {
    posts: paginatedPosts,
    isLoading,
    meta,
  } = usePosts({
    postType: "POST",
    status: currentStatus as Post["status"] | undefined,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  });

  const total = meta?.total || 0;

  const columns: AdminListColumn<Post>[] = [
    {
      header: "Title",
      skeletonWidth: "w-48",
      cell: (post) => (
        <div className="flex flex-col items-start gap-1">
          <Link
            href={`/admin/posts/${post.id}`}
            className="text-sm font-bold text-foreground transition-colors hover:text-primary"
          >
            {post.title || post.slug.replace(/-/g, " ")}
          </Link>
          <span className="font-mono text-xs lowercase text-foreground/45">/{post.slug.toLowerCase()}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      skeletonWidth: "w-16",
      cell: (post) => (
        <AdminRowActions
          editHref={`/admin/posts/${post.id}`}
          onDelete={(isPermanent) => removePost(post.id, isPermanent)}
          isDeleted={post.isDeleted || post.status === "TRASHED"}
          deleteMessage={post.isDeleted || post.status === "TRASHED"
            ? `Permanently delete post “${post.title}”?`
            : `Move post “${post.title}” to trash?`}
        />
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="posts"
        description="Manage your blog posts and articles"
        actions={(
          <Link href="/admin/posts/new">
            <AdminButton variant="primary" className="gap-2">
              <FiPlus aria-hidden="true" />
              <span>New</span>
            </AdminButton>
          </Link>
        )}
      />

      <div className="mx-auto w-full max-w-3xl">
        <AdminSearchInput
          value={search}
          onChange={(value) => { setSearch(value); setCurrentPage(1); }}
          label="Search posts"
          placeholder="Search posts..."
          className="w-full"
        />
      </div>

      <Tabs
        value={currentStatus.toLowerCase()}
        onValueChange={(value) => {
          setCurrentStatus(value.toUpperCase());
          setCurrentPage(1);
        }}
      >
        <TabsList className="mx-auto w-full max-w-3xl justify-start text-left">
          <TabsTrigger className="pl-0 text-left" value="published">Published</TabsTrigger>
          <TabsTrigger className="text-left" value="draft">Draft</TabsTrigger>
          <TabsTrigger className="text-left" value="trashed">Trashed</TabsTrigger>
        </TabsList>
      </Tabs>

      <AdminList
        columns={columns}
        data={paginatedPosts}
        isLoading={isLoading}
        skeletonCount={pageSize}
        emptyMessage="No posts found."
      />

      <div className="mx-auto w-full max-w-3xl">
        <Pagination
          total={total}
          current={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          showTotal
        />
      </div>
    </div>
  );
}
