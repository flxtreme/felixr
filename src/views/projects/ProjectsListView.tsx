"use client";

import Link from "next/link";
import { usePosts } from "@/src/features/public/posts/hooks";
import { Pagination } from "@/src/components/Pagination";
import { Breadcrumbs } from "@/src/components/BreadCrumbs";
import { PageLayout } from "@/src/layouts/PageLayout";
import { use } from "react";

export default function ProjectsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = use(searchParams);
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 5;

  const {
    posts: paginatedProjects,
    meta,
    isLoading,
  } = usePosts({
    postType: "PAGE",
    status: "PUBLISHED",
    tags: ["project", "projects"],
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  });

  const totalPages = Math.ceil((meta?.total || 0) / pageSize) || 1;

  // Note: We assume the backend handles the exclusion of reserved system slugs
  // when filtering by the "project" tag.

  return (
    <PageLayout
      title={
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
          <Breadcrumbs items={[{ label: "projects" }]} />
        </div>
      }
    >
      <div className="flex flex-col gap-12">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm font-mono text-foreground/40 animate-pulse">
              Loading projects...
            </p>
          </div>
        )}

        {paginatedProjects.length > 0
          ? paginatedProjects.map((project, id) => {
              const publishedAt = project?.publishedAt ?? project?.createdAt ?? project?.updatedAt;

              return (
                <article key={`${project.slug}-${id}}`} className="group flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground/40 mb-2 font-mono">
                    {publishedAt ? new Date(publishedAt).getFullYear() : "-"}
                  </span>
                  <h2 className="text-xl font-bold hover:text-primary transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title || project.slug.replace(/-/g, " ")}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm font-medium text-foreground/60 leading-relaxed line-clamp-3">
                    {project.excerpt && project.excerpt.replace(/[#*`]/g, "").substring(0, 200)}...
                  </p>
                </article>
              );
            })
          : !isLoading && (
              <p className="text-foreground/40 font-medium italic">No projects found.</p>
            )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/projects" />
    </PageLayout>
  );
}
