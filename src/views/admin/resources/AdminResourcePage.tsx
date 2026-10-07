"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Pagination } from "flxtheme";
import { AdminList, type AdminListColumn } from "@/src/features/admin/components/AdminList";
import { AdminResourceList } from "@/src/features/admin/components/AdminResourceList";
import { AdminResourceForm } from "@/src/features/admin/components/AdminResourceForm";
import { AdminRowActions } from "@/src/features/admin/components/AdminRowActions";
import { formatDate } from "@/src/utils/date";
import { cln } from "@/src/utils/cln";
import { useDashboard } from "@/src/features/admin/DashboardContext";
import { useAdminResources } from "@/src/features/admin/resources/hooks/useAdminResources";
import { useAdminResourceActions } from "@/src/features/admin/resources/hooks/useAdminResourceActions";
import { CertificationCard } from "@/src/components/CertificationCard";
import { TrainingCard } from "@/src/components/TrainingCard";
import type { Certification } from "@/src/features/public/certifications/types";
import type { Training } from "@/src/features/public/trainings/types";
import { configs, type ResourceKey, type ResourceRecord, displayCell } from "@/src/features/admin/resources/configs"

const pageSize = 10;

export default function AdminResourcePage({ resource }: { resource: ResourceKey }) {
  const config = configs[resource];
  const { setDashboardTitle, setRightPanel } = useDashboard();
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get("search");
  const statusFromUrl = searchParams.get("status");
  const createFromUrl = searchParams.get("create");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [offset, setOffset] = useState(0);
  const [editing, setEditing] = useState<ResourceRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    setDashboardTitle(config.title);
    setRightPanel(config.rightPanel ?? null);
  }, [config.title, setDashboardTitle, config.rightPanel, setRightPanel]);

  useEffect(() => {
    if (createFromUrl === "1") {
      setEditing(null);
      setActionError("");
      setFormOpen(true);
    }
  }, [createFromUrl]);



  useEffect(() => {
    if (searchFromUrl === null) return;
    setSearch(searchFromUrl);
    setStatus(statusFromUrl === "all" ? "all" : "active");
    setOffset(0);
  }, [searchFromUrl, statusFromUrl]);

  const params = {
    limit: pageSize,
    offset,
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(status !== "all" ? { isActive: status === "active" } : {}),
  };
  const { records, total, error, isLoading } = useAdminResources(config.endpoint, params);
  const { create, update, remove } = useAdminResourceActions(config.endpoint);
  const columns: AdminListColumn<ResourceRecord>[] = [
    ...config.columns
      .filter((column) => resource !== "users" || column.key === "name")
      .map((column) => ({
        header: column.label,
        skeletonWidth: "w-28",
        cell: (record: ResourceRecord) => resource === "gigs" || resource === "stacks" || resource === "tags" ? (
          <div className="flex min-w-0 flex-col gap-1" title={displayCell(record[column.key])}>
            {resource === "stacks" && (
              <span className="font-mono text-[10px] uppercase tracking-wide text-foreground/45">
                {displayCell(record.category)}
              </span>
            )}
            <span className="text-sm text-foreground/75">
              {displayCell(resource === "stacks" ? record.label : resource === "tags" ? record.name : record.title)}
            </span>
            {resource === "tags" ? (
              <span className="font-mono text-xs lowercase text-foreground/45">/{String(record.slug ?? "").toLowerCase()}</span>
            ) : (
              <time dateTime={String(record.createdAt ?? "")} className="text-xs text-foreground/40">
                {formatDate(String(record.createdAt ?? ""))}
              </time>
            )}
          </div>
        ) : (
          <div className="block min-w-0 text-sm text-foreground/75" title={displayCell(record[column.key])}>
            {column.format ? column.format(record[column.key], record) : displayCell(record[column.key])}
          </div>
        ),
      })),
    ...(resource === "users" || resource === "gigs" || resource === "stacks" || resource === "tags"
      ? []
      : [
        {
          header: "Status",
          skeletonWidth: "w-16",
          cell: (record: ResourceRecord) => (
            <span className={cln("text-xs", record.isDeleted ? "text-foreground/35" : "text-emerald-500/70")}>
              {record.isDeleted ? "deleted" : "active"}
            </span>
          ),
        },
        {
          header: "Updated",
          skeletonWidth: "w-24",
          cell: (record: ResourceRecord) => (
            <span className="text-xs font-mono text-foreground/45">
              {formatDate(record.updatedAt as string)}
            </span>
          ),
        },
      ]),
    {
      header: "Actions",
      className: "text-right",
      skeletonWidth: "w-28",
      cell: (record) => (
        <AdminRowActions
          onEdit={() => { setEditing(record); setFormOpen(true); setActionError(""); }}
          onDelete={(isPermanent) => void removeRecord(record, isPermanent)}
          isDeleted={Boolean(record.isDeleted)}
          deleteMessage={record.isDeleted
            ? `Permanently delete ${String(record.title ?? record.name ?? record.username ?? "this record")}?`
            : `Move ${String(record.title ?? record.name ?? record.username ?? "this record")} to trash?`}
        />
      ),
    },
  ];

  const removeRecord = async (record: ResourceRecord, isPermanent = false) => {
    setActionError("");
    try {
      await remove(record.id, isPermanent);
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Could not delete this record.");
    }
  };

  const saveRecord = async (payload: Record<string, unknown>) => {
    setSaving(true);
    setActionError("");
    try {
      if (editing) await update(editing.id, payload);
      else await create(payload);
      setFormOpen(false);
      setEditing(null);
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Could not save this record.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminResourceList
        title={config.title}
        description={config.description}
        search={search}
        onSearchChange={(value) => { setSearch(value); setOffset(0); }}
        filter={status}
        onFilterChange={(value) => { setStatus(value); setOffset(0); }}
        createLabel={`new ${config.singular}`}
        onCreate={() => { setEditing(null); setFormOpen(true); setActionError(""); }}
      >
        {error ? (
          <p className="border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-500" role="alert">Could not load {config.title}: {error.message}</p>
        ) : actionError ? (
          <p className="border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500" role="alert">{actionError}</p>
        ) : null}
        {!error && (resource === "certifications" || resource === "trainings") ? (
          isLoading ? (
            <p className="py-12 text-center text-sm text-foreground/45">Loading {config.title}...</p>
          ) : records.length === 0 ? (
            <p className="py-12 text-center text-sm text-foreground/45">No {config.title} found.</p>
          ) : (
            <ul className="mx-auto w-full max-w-5xl columns-1 gap-6 sm:columns-2 lg:columns-3">
              {records.map((record) => (
                resource === "certifications" ? (
                  <CertificationCard
                    key={record.id}
                    certification={record as unknown as Certification}
                    actions={(
                      <AdminRowActions
                        onEdit={() => { setEditing(record); setFormOpen(true); setActionError(""); }}
                        onDelete={(isPermanent) => void removeRecord(record, isPermanent)}
                        isDeleted={Boolean(record.isDeleted)}
                        deleteMessage={record.isDeleted
                          ? `Permanently delete ${String(record.title ?? "this record")}?`
                          : `Move ${String(record.title ?? "this record")} to trash?`}
                      />
                    )}
                  />
                ) : (
                  <TrainingCard
                    key={record.id}
                    training={record as unknown as Training}
                    actions={(
                      <AdminRowActions
                        onEdit={() => { setEditing(record); setFormOpen(true); setActionError(""); }}
                        onDelete={(isPermanent) => void removeRecord(record, isPermanent)}
                        isDeleted={Boolean(record.isDeleted)}
                        deleteMessage={record.isDeleted
                          ? `Permanently delete ${String(record.title ?? "this record")}?`
                          : `Move ${String(record.title ?? "this record")} to trash?`}
                      />
                    )}
                  />
                )
              ))}
            </ul>
          )
        ) : !error ? (
          <AdminList columns={columns} data={records} isLoading={isLoading} emptyMessage={`No ${config.title} found.`} />
        ) : null}
        <div className="mx-auto w-full max-w-3xl">
          <Pagination
            total={total}
            current={Math.floor(offset / pageSize) + 1}
            pageSize={pageSize}
            onPageChange={(page) => setOffset((page - 1) * pageSize)}
            showTotal
          />
        </div>
      </AdminResourceList>
      {formOpen && (
        <AdminResourceForm
          title={config.singular}
          fields={config.fields}
          initialValues={editing ?? undefined}
          isEditing={Boolean(editing)}
          isSaving={saving}
          error={actionError}
          onClose={() => { setFormOpen(false); setEditing(null); setActionError(""); }}
          onSubmit={saveRecord}
        />
      )}
    </>
  );
}
