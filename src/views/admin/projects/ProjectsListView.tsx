"use client";

import { useProjects } from "@/src/features/admin/project/hooks";
import { useProjectContext } from "@/src/features/admin/project/ProjectContext";
import { LuPen, LuExternalLink, LuPlus, LuTrash2 } from "flxtheme/icons/lu";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Pagination } from "flxtheme";

export default function ProjectsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const router = useRouter();
  const { removeProject } = useProjectContext();
  const resolvedParams = React.use(searchParams);

  const [currentPage, setCurrentPage] = React.useState(
    Math.max(1, Number(resolvedParams?.page) || 1)
  );
  const pageSize = 10;

  const {
    projects,
    isLoading,
    meta,
  } = useProjects({
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
    search: resolvedParams?.search || null,
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm font-mono font-medium text-foreground/40">
            Manage your work and portfolio
          </p>
        </div>
        <Link
          href="/admin/projects/new"
        >
          <Button
            variant="primary"
            size="sm"
          >
            <span>Create Project</span>
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {projects.map((project, i) => {
          return (
            <Card key={i} className="flex h-full flex-col p-6">
              <h3 className="mb-2 text-lg font-medium">{project.title}</h3>
              <p className="line-clamp-3 text-sm text-foreground/70">{project.description}</p>
              <div className="mt-auto flex flex-wrap items-center justify-end gap-2 pt-8">
                <Link href={`/projects/${project.page.slug}`}>
                  <Button variant="secondary" size="sm">
                    Preview
                  </Button>
                </Link>
                <Link href={`/admin/projects/${project.id}`}>
                  <Button variant="primary" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-red-500"
                  onClick={() => removeProject(project.id)}
                >
                  Remove
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {!isLoading && projects.length === 0 && (
        <div className="py-12 text-center text-foreground/50">
          No projects found.
        </div>
      )}

      <div className="pt-8">
        <Pagination 
          current={currentPage} 
          total={meta?.total || 0} 
          pageSize={pageSize} 
          onPageChange={(page) => {
            setCurrentPage(page);
            router.push(`/admin/projects?page=${page}${resolvedParams?.search ? `&search=${resolvedParams.search}` : ''}`);
          }} 
        />
      </div>
    </div>
  );
}