"use client";

import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Pagination, Skeleton } from "flxtheme";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { useProjects } from "@/src/features/public/projects/hooks";
import { PageHeader } from "@/src/components/PageHeader";
import { SectionDivider } from "@/src/components/SectionDivider";

const cleanExcerpt = (excerpt?: string | null) =>
  excerpt?.replace(/[#*`]/g, "").substring(0, 200) || "A project built for the web.";

const listClass = "columns-1 gap-6 sm:columns-2 lg:columns-3";

export default function ProjectsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const router = useRouter();
  const { page } = use(searchParams);
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 9;

  const {
    projects: paginatedProjects,
    meta,
    isLoading,
  } = useProjects({
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  });

  return (
    <main className="overflow-hidden">
      <PageHeader eyebrow="projects" title="Things I've shipped.">
        <Breadcrumb>
          <BreadcrumbItem href="/">home</BreadcrumbItem>
          <BreadcrumbItem>projects</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>
      <SectionDivider />
      <section id="projects">
        <div className="mx-auto max-w-5xl px-6 py-10">
          {isLoading ? (
            <ul className={listClass}>
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
          ) : paginatedProjects.length > 0 ? (
            <ul className={listClass}>
              {paginatedProjects.map((project, index) => {
                const projectPage = project.page;
                const slug = projectPage?.slug?.toLowerCase();
                const href = slug ? `/projects/${slug}` : undefined;
                const title = projectPage?.title || project.title;

                return (
                  <li key={`${project.id}-${index}`} className="mb-6 break-inside-avoid">
                    <article className="border border-foreground/10">
                      <div className="p-4">
                        <h2 className="text-sm font-bold leading-tight text-foreground/80">
                          {href ? (
                            <Link href={href} className="transition-colors hover:text-primary">
                              {title}
                            </Link>
                          ) : (
                            title
                          )}
                        </h2>
                      </div>

                      <div className="space-y-4 px-4 pb-4">
                        <p className="text-xs leading-5 text-foreground/55">
                          {cleanExcerpt(projectPage?.excerpt || project.description)}
                        </p>
                        {href && (
                          <Link
                            href={href}
                            className="inline-flex text-xs font-bold text-primary transition-colors hover:text-foreground"
                          >
                            View project <span aria-hidden="true" className="ml-1">↗</span>
                          </Link>
                        )}
                        {project.links && project.links.length > 0 && (
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
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-foreground/45">No projects found.</p>
          )}

          <div className="mx-auto mt-12 max-w-3xl border-t border-foreground/10 pt-8">
            <Pagination
              current={currentPage}
              total={meta?.total || 0}
              pageSize={pageSize}
              onPageChange={(p) => router.push(`/projects?page=${p}`)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}