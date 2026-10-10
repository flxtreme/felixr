"use client";

import React, { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiDownload } from "flxtheme/icons/fi";
import { Pagination, Select, type SelectProps } from "flxtheme";
import { useFormSubmissions, useForms } from "@/src/features/admin/forms/hooks";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { AdminList, type AdminListColumn } from "@/src/features/admin/components/AdminList";
import { AdminPageHeader } from "@/src/features/admin/components/AdminPageHeader";
import { AdminSearchInput } from "@/src/features/admin/components/AdminSearchInput";
import { useDashboard } from "@/src/features/admin/DashboardContext";
import { WidgetRegistry } from "@/src/features/admin/components/WidgetRegistry";
import type { Form, FormSubmission, FormStatus } from "@/src/features/admin/forms/types";
import { cln } from "@/src/utils/cln";

export default function SubmissionsListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; formId?: string; search?: string }>;
}) {
  const { setRightPanel } = useDashboard();
  const resolvedParams = React.use(searchParams);

  const [currentPage, setCurrentPage] = useState(
    Math.max(1, Number(resolvedParams?.page) || 1)
  );
  const [search, setSearch] = useState(resolvedParams?.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());
  const [formFilter, setFormFilter] = useState(resolvedParams?.formId ?? "");
  const pageSize = 10;

  useEffect(() => {
    setSearch(resolvedParams?.search ?? "");
    setFormFilter(resolvedParams?.formId ?? "");
    setCurrentPage(Math.max(1, Number(resolvedParams?.page) || 1));
  }, [resolvedParams?.page, resolvedParams?.formId, resolvedParams?.search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const { forms: allForms } = useForms({ limit: 100 });
  
  const {
    submissions: paginatedSubmissions,
    isLoading,
    meta,
  } = useFormSubmissions({
    formId: formFilter || undefined,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    page: currentPage,
    limit: pageSize,
  });

  const total = meta?.total || 0;

  const columns: AdminListColumn<FormSubmission>[] = [
    {
      header: "Form",
      skeletonWidth: "w-40",
      cell: (submission) => (
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm font-medium text-foreground">
            {allForms.find(f => f.id === submission.formId)?.name || submission.formId}
          </span>
          <span className="font-mono text-xs text-foreground/45">{submission.formId.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      header: "Data",
      skeletonWidth: "w-64",
      cell: (submission) => (
        <div className="max-w-xs">
          <pre className="text-xs text-foreground/60 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
            {JSON.stringify(submission.data).slice(0, 100)}
          </pre>
        </div>
      ),
    },
    {
      header: "Submitted",
      className: "text-right",
      skeletonWidth: "w-24",
      cell: (submission) => (
        <span className="text-sm text-foreground/60 font-mono">
          {new Date(submission.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: "User/IP",
      className: "text-right",
      skeletonWidth: "w-24",
      cell: (submission) => (
        <div className="text-right">
          {submission.userId ? (
            <span className="text-sm text-foreground/60 font-mono">User: {submission.userId.slice(0, 8)}...</span>
          ) : submission.ipAddress ? (
            <span className="text-sm text-foreground/60 font-mono">{submission.ipAddress}</span>
          ) : (
            <span className="text-sm text-foreground/40">Anonymous</span>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    setRightPanel(
      <WidgetRegistry includes={["quick-create"]} />
    );
    return () => setRightPanel(null);
  }, []);

  const formOptions: SelectProps["options"] = [
    { value: "", label: "All Forms" },
    ...allForms.map((form) => ({ value: form.id, label: form.name })),
  ];

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="submissions"
        description="View and manage form submissions"
        actions={(
          <AdminButton variant="outline" className="gap-2">
            <FiDownload aria-hidden="true" />
            <span>Export CSV</span>
          </AdminButton>
        )}
      />

      <div className="mx-auto w-full max-w-5xl space-y-4">
        <div className="flex flex-wrap gap-4">
          <AdminSearchInput
            value={search}
            onChange={(value) => { setSearch(value); setCurrentPage(1); }}
            label="Search submissions"
            placeholder="Search in submission data..."
            className="flex-1 min-w-[250px]"
          />
          {/* <Select
            value={formFilter}
            onValueChange={setFormFilter}
            options={formOptions}
            className="w-[200px]"
            placeholder="All Forms"
          /> */}
        </div>
      </div>

      <AdminList
        columns={columns}
        data={paginatedSubmissions}
        isLoading={isLoading}
        skeletonCount={pageSize}
        emptyMessage="No submissions found."
      />

      <div className="mx-auto w-full max-w-5xl">
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