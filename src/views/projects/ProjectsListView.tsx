"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "flxtheme";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { use } from "react";
import { PostShimmer } from "@/src/components/shimmer/PostShimmer";
import { useProjects } from "@/src/features/public/projects/hooks";
import { PostCard } from "@/src/components/PostCard";
import { PageHeader } from "@/src/components/PageHeader";
import { SectionDivider } from "@/src/components/SectionDivider";
import { formatShortDate } from "@/src/utils/date";

const cleanExcerpt = (excerpt?: string | null) =>
  excerpt?.replace(/[#*`]/g, "").substring(0, 200) || "A project built for the web.";

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
      <PageHeader
        eyebrow="projects"
        title="Things I've shipped."
      >
        <Breadcrumb>
          <BreadcrumbItem href="/">home</BreadcrumbItem>
          <BreadcrumbItem>projects</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>
      <SectionDivider />
      <section id="projects">
        <div className="mx-auto max-w-3xl px-6 py-10">
          {isLoading && <PostShimmer />}
          {paginatedProjects.length > 0 ? (
            <div className="divide-y divide-foreground/10">
              {paginatedProjects.map((project, index) => {
                const page = project.page;
                const publishedAt = page?.publishedAt ?? page?.createdAt ?? page?.updatedAt;

                return (
                  <PostCard
                    key={`${project.id}-${index}`}
                    href={`/projects/${page?.slug}`}
                    title={page?.title || project.title}
                    excerpt={cleanExcerpt(page?.excerpt || project.description)}
                    dateLabel={formatShortDate(publishedAt) || "Recent"}
                    variant="compact"
                    excerptSize="sm"
                  />
                );
              })}
            </div>
          ) : (
            !isLoading && <p className="text-sm text-foreground/45">No projects found.</p>
          )}

          <div className="mt-12 border-t border-foreground/10 pt-8">
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
