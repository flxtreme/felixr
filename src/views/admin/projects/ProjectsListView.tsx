"use client";

import React from "react";
import Link from "next/link";
import { Edit2, Trash2, Plus, ExternalLink, Calendar } from "lucide-react";
import { Pagination } from "@/src/components/Pagination";
import { useProjects } from "@/src/features/admin/project/hooks";
import { useProjectContext } from "@/src/features/admin/project/ProjectContext";
import { Project } from "@/src/features/admin/project/types";
import { AdminTable, Column } from "@/src/features/admin/components/AdminTable";
import { Button } from "@/src/components/Button";
import { SOCIAL_ICONS } from "@/src/common/icons";
import { stringToKey } from "@/src/utils/string";

export default function ProjectsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
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

  const totalPages = Math.ceil((meta?.total || 0) / pageSize) || 1;

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
            <Plus className="size-4 ml-2" />
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {
          projects.map((project, i) => {
            return (
              <div key={i} className="flex flex-col bg-surface shadow rounded-sm border p-6 border-foreground/10">
                <h3 className="mb-2 font-medium text-lg">{project.title}</h3>
                <p>{project.description}</p>
                <div className="flex gap-2 items-center justify-end mt-8">
                  <Link href={`/projects/${project.page.slug}`}>
                    <Button
                      variant="tertiary"
                      size="sm"
                    >
                      <ExternalLink className="size-4 mr-2" />
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/admin/projects/${project.id}`}>
                    <Button
                      variant="tertiary"
                      size="sm"
                    >
                      <Edit2 className="size-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="tertiary"
                    size="sm"
                    className="text-red-500"
                    onClick={() => removeProject(project.id)}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            );
          })
        }
      </div>

      {!isLoading && projects.length === 0 && (
        <div className="py-12 text-center text-foreground/50">
          No projects found.
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/admin/projects"
      />
    </div>
  );
}