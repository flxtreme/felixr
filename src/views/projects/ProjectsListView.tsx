"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "flxtheme";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { use } from "react";
import { PostShimmer } from "@/src/components/shimmer/PostShimmer";
import { useProjects } from "@/src/features/public/projects/hooks";
import { ProjectCard } from "@/src/features/public/components/ProjectCard";

export default function ProjectsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const router = useRouter();
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

  // Note: We assume the backend handles the exclusion of reserved system slugs
  // when filtering by the "project" tag.

  return (
    <main className="overflow-hidden">
      <section className="hero-dot-grid">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-14 lg:pb-16 lg:pt-20">
          <p className="eyebrow">Selected work</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[0.94] tracking-[-0.04em] text-foreground sm:text-6xl">
            Things I&apos;ve
            <br />
            <span className="text-primary">shipped.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-foreground/55">
            A collection of products, experiments, and systems built across the web stack.
          </p>
          <div className="mt-6">
            <Breadcrumb>
              <BreadcrumbItem>projects</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </section>

      <section className="bg-surface/45">
        <div className="mx-auto max-w-6xl px-6 py-20">
          {isLoading && <PostShimmer />}
          {paginatedProjects.length > 0 ? (
            <div className="flex flex-col divide-y divide-border">
              {paginatedProjects.map((project, index) => (
                <ProjectCard key={`${project.id}-${index}`} project={project} />
              ))}
            </div>
          ) : (
            !isLoading && <p className="text-sm text-foreground/45">No projects found.</p>
          )}

          <div className="mt-12 border-t border-border pt-8">
            <Pagination
              current={currentPage}
              total={meta?.total || 0}
              pageSize={pageSize}
              onPageChange={(page) => router.push(`/projects?page=${page}`)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
