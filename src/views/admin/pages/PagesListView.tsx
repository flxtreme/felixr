"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Pagination, Tabs, TabsList, TabsTrigger } from "flxtheme";
import { usePosts } from "@/src/features/admin/posts/hooks";
import { usePagesContext } from "@/src/features/admin/pages/PagesContext";
import type { Post } from "@/src/features/admin/posts/types";
import { AdminList, type AdminListColumn } from "@/src/features/admin/components/AdminList";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { AdminPageHeader } from "@/src/features/admin/components/AdminPageHeader";
import { AdminRowActions } from "@/src/features/admin/components/AdminRowActions";
import { AdminSearchInput } from "@/src/features/admin/components/AdminSearchInput";
import { useDashboard } from "@/src/features/admin/DashboardContext";
import { WidgetRegistry } from "@/src/features/admin/components/WidgetRegistry";

export default function PagesListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const router = useRouter();
  const { setRightPanel } = useDashboard();
  const { removePage } = usePagesContext();
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
    posts: paginatedPages,
    isLoading,
    meta,
  } = usePosts({
    postType: "PAGE",
    status: currentStatus as Post["status"] | undefined,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  });

  const columns: AdminListColumn<Post>[] = [
    {
      header: "Title",
      skeletonWidth: "w-48",
      cell: (page) => (
        <div className="flex flex-col items-start gap-1">
          <Link
            href={`/admin/pages/${page.id}`}
            className="text-sm font-bold text-foreground transition-colors hover:text-primary"
          >
            {page.title || page.slug.replace(/-/g, " ")}
          </Link>
          <span className="font-mono text-xs lowercase text-foreground/45">/{page.slug.toLowerCase()}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      skeletonWidth: "w-16",
      cell: (page) => (
        <AdminRowActions
          editHref={`/admin/pages/${page.id}`}
          onDelete={(isPermanent) => removePage(page.id, isPermanent)}
          isDeleted={page.isDeleted || page.status === "TRASHED"}
          deleteMessage={page.isDeleted || page.status === "TRASHED"
            ? `Permanently delete page “${page.title}”?`
            : `Move page “${page.title}” to trash?`}
        />
      ),
    },
  ];

  useEffect(() => {
    setRightPanel(
      <WidgetRegistry includes={[
        "quick-create"
      ]} />
    )
    return () => setRightPanel(null)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="pages"
        description="Manage your static pages"
        actions={(
          <Link href="/admin/pages/new">
            <AdminButton variant="primary" className="gap-2">
              <Plus aria-hidden="true" className="size-4" />
              <span>New</span>
            </AdminButton>
          </Link>
        )}
      />

      <div className="mx-auto w-full max-w-3xl">
        <AdminSearchInput
          value={search}
          onChange={(value) => { setSearch(value); setCurrentPage(1); }}
          label="Search pages"
          placeholder="Search pages..."
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
        data={paginatedPages}
        isLoading={isLoading}
        emptyMessage="No pages found."
      />

      <div className="mx-auto w-full max-w-3xl pt-8">
        <Pagination
          current={currentPage}
          total={meta?.total || 0}
          pageSize={pageSize}
          onPageChange={(page) => {
            setCurrentPage(page);
            const query = new URLSearchParams({
              status: currentStatus.toLowerCase(),
              page: String(page),
            });
            if (search.trim()) query.set("search", search.trim());
            router.push(`/admin/pages?${query.toString()}`);
          }}
        />
      </div>
    </div>
  );
}
