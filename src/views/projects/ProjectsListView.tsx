"use client";

import Link from "next/link";
import { usePosts } from "@/src/features/public/posts/hooks";
import { Pagination } from "@/src/components/Pagination";
import { Breadcrumbs } from "@/src/components/BreadCrumbs";
import { PageLayout } from "@/src/layouts/PageLayout";
import { use } from "react";
import { PostShimmer } from "@/src/components/shimmer/PostShimmer";
import { useProjects } from "@/src/features/public/projects/hooks";
import { ProjectCard } from "@/src/features/public/components/ProjectCard";

export default function ProjectsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = use(searchParams);
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 5;

  const {
    projects: paginatedProjects,
    meta,
    isLoading,
  } = useProjects({
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
      <div className="flex flex-col gap-8">
        {isLoading && (
          <PostShimmer />
        )}

        {paginatedProjects.length > 0
          ? paginatedProjects.map((project, id) => {
            return <ProjectCard key={`${project.id}-${id}`} project={project} noCard />
          })
          : !isLoading && (
            <p className="text-foreground/40 font-medium italic">No projects found.</p>
          )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/projects" />
    </PageLayout>
  );
}
