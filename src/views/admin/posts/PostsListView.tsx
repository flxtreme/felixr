"use client";

import React from "react";
import Link from "next/link";
import { FiEdit, FiTrash2, FiPlus, FiTag } from "flxtheme/icons/fi";
import {
  Button,
  IconButton,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  Pagination,
  Skeleton,
} from "flxtheme";
import { usePosts } from "@/src/features/admin/posts/hooks";
import { usePostContext } from "@/src/features/admin/posts/PostsContext";
import { Post } from "@/src/features/admin/posts/types";

const STATUS_VARIANT: Record<string, "success" | "secondary" | "destructive"> = {
  PUBLISHED: "success",
  DRAFT: "secondary",
  TRASHED: "destructive",
};

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

  const total = meta?.total || 0;

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-sm font-mono font-medium text-muted-foreground">
            Manage your blog posts and articles
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button variant="primary" size="sm">
            <span>Create Post</span>
            <FiPlus className="ml-2" />
          </Button>
        </Link>
      </header>

      <Tabs
        value={currentStatus.toLowerCase()}
        onValueChange={(v) => {
          setCurrentStatus(v.toUpperCase());
          setCurrentPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="trashed">Trashed</TabsTrigger>
        </TabsList>
      </Tabs>

      <Table striped hoverable>
        <TableHeader>
          <TableRow>
            <TableCell header>Title</TableCell>
            <TableCell header>Status</TableCell>
            <TableCell header>Tags</TableCell>
            <TableCell header className="text-right">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: pageSize }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton variant="text" className="w-48" /></TableCell>
                <TableCell><Skeleton variant="text" className="w-20" /></TableCell>
                <TableCell><Skeleton variant="text" className="w-32" /></TableCell>
                <TableCell className="text-right"><Skeleton variant="text" className="w-16 ml-auto" /></TableCell>
              </TableRow>
            ))}

          {!isLoading && paginatedPosts.length === 0 && (
            <TableRow>
              <TableCell className="text-center text-muted-foreground py-8">
                No posts found.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            paginatedPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="space-y-1">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-sm font-bold text-foreground hover:text-primary transition-colors block"
                    >
                      {post.title || post.slug.replace(/-/g, " ")}
                    </Link>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">
                      /{post.slug}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[post.status] ?? "secondary"} size="sm">
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground uppercase">
                    <FiTag className="text-muted-foreground" />
                    <span>
                      {((post?.tags ?? post.metadata?.tags) as string[])?.join(", ") ||
                        "NO TAGS"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/posts/${post.id}`}>
                      <IconButton icon={<FiEdit />} aria-label="Edit" variant="ghost" size="sm" />
                    </Link>
                    <IconButton
                      icon={<FiTrash2 />}
                      aria-label="Delete"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm("Delete this post?")) removePost(post.id);
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Pagination
        total={total}
        current={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        showTotal
      />
    </div>
  );
}