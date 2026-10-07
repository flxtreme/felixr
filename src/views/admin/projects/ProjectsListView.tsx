"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pagination, Skeleton, Tabs, TabsList, TabsTrigger } from "flxtheme";
import { FiPlus } from "flxtheme/icons/fi";
import { useProjects } from "@/src/features/admin/project/hooks";
import { useProjectContext } from "@/src/features/admin/project/ProjectContext";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { AdminPageHeader } from "@/src/features/admin/components/AdminPageHeader";
import { AdminRowActions } from "@/src/features/admin/components/AdminRowActions";
import type { Project } from "@/src/features/admin/project/types";
import { formatDate } from "@/src/utils/date";
import { AdminSearchInput } from "@/src/features/admin/components/AdminSearchInput";

export default function ProjectsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const router = useRouter();
  const { removeProject } = useProjectContext();
  const resolvedParams = searchParams ? React.use(searchParams) : undefined;

  const currentStatus = (resolvedParams?.status ?? "published").toUpperCase();
  const currentPage = Math.max(1, Number(resolvedParams?.page) || 1);
  const [search, setSearch] = useState(resolvedParams?.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());
  const pageSize = 10;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const trimmed = search.trim();
      setDebouncedSearch(trimmed);
      const query = new URLSearchParams();
      if (currentStatus) query.set("status", currentStatus.toLowerCase());
      if (trimmed) query.set("search", trimmed);
      router.push(`/admin/projects?${query.toString()}`);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const { projects, isLoading, error, meta } = useProjects({
    status: currentStatus as Project["status"] | undefined,
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
    search: debouncedSearch || null,
  });

  return (
    <div className="space-y-6 p-6">
      <AdminPageHeader
        title="projects"
        description="Manage your work and portfolio"
        actions={(
          <Link href="/admin/projects/new">
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
          onChange={(value) => setSearch(value)}
          label="Search projects"
          placeholder="Search projects..."
          className="w-full"
        />
      </div>

      <Tabs
        value={currentStatus.toLowerCase()}
        onValueChange={(value) => {
          const query = new URLSearchParams({
            status: value,
            page: "1",
          });
          if (search.trim()) query.set("search", search.trim());
          router.push(`/admin/projects?${query.toString()}`);
        }}
      >
        <TabsList className="mx-auto w-full max-w-3xl justify-start text-left">
          <TabsTrigger className="pl-0 text-left" value="published">Published</TabsTrigger>
          <TabsTrigger className="text-left" value="draft">Draft</TabsTrigger>
          <TabsTrigger className="text-left" value="trashed">Trashed</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <ul className="mx-auto w-full max-w-5xl columns-1 gap-6 sm:columns-2 2xl:columns-3">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index} className="mb-6 break-inside-avoid border border-foreground/10 p-4">
              <Skeleton variant="text" className="mb-3 h-4 w-24" />
              <Skeleton variant="text" className="mb-3 h-6 w-3/4" />
              <Skeleton variant="text" className="mb-2 h-4 w-full" />
              <Skeleton variant="text" className="mb-4 h-4 w-2/3" />
              <Skeleton variant="text" className="h-4 w-20" />
            </li>
          ))}
        </ul>
      ) : error ? (
        <p className="py-12 text-center text-sm text-foreground/55">
          Projects couldn&apos;t be loaded. Please try refreshing or checking server connection.
        </p>
      ) : projects.length === 0 ? (
        <p className="py-12 text-center text-sm text-foreground/45">No projects found.</p>
      ) : (
        <ul className="mx-auto w-full max-w-5xl columns-1 gap-6 sm:columns-2 2xl:columns-3">
          {projects.map((project: Project) => (
            <li key={project.id} className="mb-6 break-inside-avoid">
              <article className="border border-foreground/10">
                <div className="flex items-start justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] lowercase text-foreground/45">
                      {project.page?.slug ? `/${project.page.slug.toLowerCase()}` : "project"}
                    </p>
                    <h2 className="mt-2 text-sm font-bold leading-tight text-foreground/80">
                      <Link href={`/admin/projects/${project.id}`} className="transition-colors hover:text-primary">
                        {project.title}
                      </Link>
                    </h2>
                  </div>
                  <AdminRowActions
                    editHref={`/admin/projects/${project.id}`}
                    onDelete={(isPermanent) => removeProject(project.id, isPermanent)}
                    isDeleted={project.isDeleted || project.status === "TRASHED"}
                    deleteMessage={project.isDeleted || project.status === "TRASHED"
                      ? `Permanently delete project “${project.title}”?`
                      : `Move project “${project.title}” to trash?`}
                  />
                </div>

                <div className="space-y-4 px-4 pb-4">
                  <p className="text-xs leading-5 text-foreground/55">
                    {project.description || "No description provided."}
                  </p>
                  {project.page?.slug && (
                    <Link
                      href={`/projects/${project.page.slug.toLowerCase()}`}
                      className="inline-flex text-xs font-bold text-primary transition-colors hover:text-foreground"
                    >
                      View project <span aria-hidden="true" className="ml-1">↗</span>
                    </Link>
                  )}
                  {project.links?.length > 0 && (
                    <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-foreground/10 pt-3">
                      {project.links.map((link) => (
                        <li key={`${link.label}-${link.href}`}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-foreground/55 underline underline-offset-4 transition-colors hover:text-primary"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="border-t border-foreground/10 pt-3 text-[10px] font-mono text-foreground/40">
                    Updated {formatDate(project.updatedAt)}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <div className="mx-auto w-full max-w-3xl">
        <Pagination
          current={currentPage}
          total={meta?.total || 0}
          pageSize={pageSize}
          onPageChange={(page) => {
            const query = new URLSearchParams({
              status: currentStatus.toLowerCase(),
              page: String(page),
            });
            if (search.trim()) query.set("search", search.trim());
            router.push(`/admin/projects?${query.toString()}`);
          }}
          showTotal
        />
      </div>
    </div>
  );
}
