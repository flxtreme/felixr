"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus, FiArchive, FiFileText } from "flxtheme/icons/fi";
import { Pagination, Tabs, TabsList, TabsTrigger } from "flxtheme";
import { useForms, useFormActions } from "@/src/features/admin/forms/hooks";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { AdminList, type AdminListColumn } from "@/src/features/admin/components/AdminList";
import { AdminPageHeader } from "@/src/features/admin/components/AdminPageHeader";
import { AdminRowActions } from "@/src/features/admin/components/AdminRowActions";
import { AdminSearchInput } from "@/src/features/admin/components/AdminSearchInput";
import { useDashboard } from "@/src/features/admin/DashboardContext";
import { WidgetRegistry } from "@/src/features/admin/components/WidgetRegistry";
import type { Form, FormStatus } from "@/src/features/admin/forms/types";

export default function FormsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const { remove } = useFormActions();
  const { setRightPanel } = useDashboard();
  const resolvedParams = React.use(searchParams);

  const [currentStatus, setCurrentStatus] = useState<FormStatus>(
    (resolvedParams?.status as FormStatus) || "DRAFT"
  );
  const [currentPage, setCurrentPage] = useState(
    Math.max(1, Number(resolvedParams?.page) || 1)
  );
  const [search, setSearch] = useState(resolvedParams?.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());
  const pageSize = 10;

  useEffect(() => {
    setSearch(resolvedParams?.search ?? "");
    setCurrentStatus((resolvedParams?.status as FormStatus) || "DRAFT");
    setCurrentPage(Math.max(1, Number(resolvedParams?.page) || 1));
  }, [resolvedParams?.page, resolvedParams?.status, resolvedParams?.search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const {
    forms: paginatedForms,
    isLoading,
    meta,
  } = useForms({
    status: currentStatus,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    page: currentPage,
    limit: pageSize,
  });

  const total = meta?.total || 0;

  const columns: AdminListColumn<Form>[] = [
    {
      header: "Name",
      skeletonWidth: "w-48",
      cell: (form) => (
        <div className="flex flex-col items-start gap-1">
          <Link
            href={`/admin/forms/${form.id}`}
            className="text-sm font-bold text-foreground transition-colors hover:text-primary"
          >
            {form.name}
          </Link>
          <span className="font-mono text-xs lowercase text-foreground/45">/{form.slug}</span>
        </div>
      ),
    },
    {
      header: "Status",
      skeletonWidth: "w-24",
      cell: (form) => {
        const statusStyles: Record<FormStatus, string> = {
          DRAFT: "bg-amber-100 text-amber-800",
          PUBLISHED: "bg-green-100 text-green-800",
          ARCHIVED: "bg-slate-100 text-slate-800",
        };
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyles[form.status]}`}>
            {form.status}
          </span>
        );
      },
    },
    {
      header: "Updated",
      className: "text-right",
      skeletonWidth: "w-24",
      cell: (form) => (
        <span className="text-sm text-foreground/60 font-mono">
          {new Date(form.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      skeletonWidth: "w-16",
cell: (form) => (
            <AdminRowActions
              editHref={`/admin/forms/${form.id}`}
              onDelete={(isPermanent) => remove(form.id, { isPermanent })}
              isDeleted={form.isDeleted || form.status === "ARCHIVED"}
              deleteMessage={form.isDeleted || form.status === "ARCHIVED"
                ? `Permanently delete form "${form.name}"?`
                : `Move form "${form.name}" to archive?`}
            />
          ),
    },
  ];

  useEffect(() => {
    setRightPanel(
      <WidgetRegistry includes={["quick-create"]} />
    );
    return () => setRightPanel(null);
  }, []);

  const statusTabs: { value: FormStatus; label: string; icon: React.ReactNode }[] = [
    { value: "PUBLISHED", label: "Published", icon: <FiFileText /> },
    { value: "DRAFT", label: "Draft", icon: <FiFileText /> },
    { value: "ARCHIVED", label: "Archived", icon: <FiArchive /> },
  ];

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="forms"
        description="Build and manage your forms"
        actions={(
          <Link href="/admin/forms/new">
            <AdminButton variant="primary" className="gap-2">
              <FiPlus aria-hidden="true" />
              <span>New Form</span>
            </AdminButton>
          </Link>
        )}
      />

      <div className="mx-auto w-full max-w-3xl">
        <AdminSearchInput
          value={search}
          onChange={(value) => { setSearch(value); setCurrentPage(1); }}
          label="Search forms"
          placeholder="Search forms..."
          className="w-full"
        />
      </div>

      <Tabs
        value={currentStatus}
        onValueChange={(value) => {
          setCurrentStatus(value as FormStatus);
          setCurrentPage(1);
        }}
      >
        <TabsList className="mx-auto w-full max-w-3xl justify-start text-left">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="pl-0 text-left flex items-center gap-2">
              {tab.icon}
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AdminList
        columns={columns}
        data={paginatedForms}
        isLoading={isLoading}
        skeletonCount={pageSize}
        emptyMessage="No forms found."
      />

      <div className="mx-auto w-full max-w-3xl">
        <Pagination
          total={total}
          current={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          showTotal
        />
      </div>
    </div>
  );
}