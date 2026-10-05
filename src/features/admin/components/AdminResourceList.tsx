"use client";

import type { ReactNode } from "react";
import { cln } from "@/src/utils/cln";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { AdminPageHeader } from "@/src/features/admin/components/AdminPageHeader";
import { AdminSearchInput } from "@/src/features/admin/components/AdminSearchInput";
import { Select } from "@/src/components/Select";

export function AdminResourceList({
  title,
  description,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  filterLabel = "Status",
  createLabel,
  onCreate,
  children,
}: {
  title: string;
  description: string;
  search: string;
  onSearchChange: (value: string) => void;
  filter?: string;
  onFilterChange?: (value: string) => void;
  filterLabel?: string;
  createLabel: string;
  onCreate: () => void;
  children: ReactNode;
}) {
  return (
    <section className="space-y-6 p-6">
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          <AdminButton type="button" onClick={onCreate} variant="primary">
            {createLabel}
          </AdminButton>
        }
      />
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
        <AdminSearchInput
          value={search}
          onChange={onSearchChange}
          label={`Search ${title.toLowerCase()}`}
          placeholder={`Search ${title.toLowerCase()}...`}
          className="min-w-0 flex-1"
        />
        {filter !== undefined && onFilterChange && (
            <Select aria-label={`${filterLabel} filter`} value={filter} onChange={(event) => onFilterChange(event.target.value)} containerClassName="w-auto shrink-0" className={cln("border border-foreground/15 bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:border-primary")}>
              <option value="all" className="bg-background text-foreground dark:bg-black dark:text-white">all</option>
              <option value="active" className="bg-background text-foreground dark:bg-black dark:text-white">active</option>
              <option value="deleted" className="bg-background text-foreground dark:bg-black dark:text-white">deleted</option>
            </Select>
        )}
      </div>
      {children}
    </section>
  );
}
