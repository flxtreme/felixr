"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Modal, Pagination, useModal } from "flxtheme";
import { fetcher } from "@/src/utils/fetcher";
import { formatDate } from "@/src/utils/date";
import { AdminList, type AdminListColumn } from "@/src/features/admin/components/AdminList";
import { useDashboard } from "@/src/features/admin/DashboardContext";
import { AdminPageHeader } from "@/src/features/admin/components/AdminPageHeader";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { Select } from "@/src/components/Select";
import { Trash2 } from "lucide-react";

type AnalyticsFilters = {
  search: string;
  action: string;
  path: string;
  visitorId: string;
  currentUrl: string;
  ip: string;
  timestampFrom: string;
  timestampTo: string;
};

const EMPTY_FILTERS: AnalyticsFilters = {
  search: "",
  action: "",
  path: "",
  visitorId: "",
  currentUrl: "",
  ip: "",
  timestampFrom: "",
  timestampTo: "",
};

function AnalyticsFilterPanel({
  initialFilters,
  onApply,
  onClear,
}: {
  initialFilters: AnalyticsFilters;
  onApply: (filters: AnalyticsFilters) => void;
  onClear: () => void;
}) {
  const [draft, setDraft] = useState(initialFilters);

  useEffect(() => {
    setDraft(initialFilters);
  }, [initialFilters]);

  const update = (key: keyof AnalyticsFilters, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <form
      className="space-y-4 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(draft);
      }}
    >
      <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
        Filter analytics
      </h2>
      {([
        ["search", "Search"],
        ["path", "Path segment"],
        ["visitorId", "Visitor ID"],
        ["currentUrl", "Current URL"],
        ["ip", "IP address"],
      ] as const).map(([key, label]) => (
        <label key={key} className="block space-y-1.5 text-xs text-foreground/60">
          <span>{label}</span>
          <input
            type="text"
            value={draft[key]}
            onChange={(event) => update(key, event.target.value)}
            className="h-9 w-full border border-foreground/15 bg-transparent px-2.5 text-xs text-foreground outline-none focus:border-primary"
          />
        </label>
      ))}
      <label className="block space-y-1.5 text-xs text-foreground/60">
        <span>Action</span>
        <Select
          value={draft.action}
          onChange={(event) => update("action", event.target.value)}
          className="h-9 w-full border border-foreground/15 bg-transparent px-2.5 text-xs text-foreground outline-none focus:border-primary"
        >
          <option value="" className="bg-background">All actions</option>
          <option value="view" className="bg-background">View</option>
          <option value="insert" className="bg-background">Insert</option>
          <option value="update" className="bg-background">Update</option>
          <option value="soft_delete" className="bg-background">Soft delete</option>
          <option value="delete" className="bg-background">Delete</option>
        </Select>
      </label>
      <div className="grid grid-cols-1 gap-3">
        {([
          ["timestampFrom", "From"],
          ["timestampTo", "To"],
        ] as const).map(([key, label]) => (
          <label key={key} className="block space-y-1.5 text-xs text-foreground/60">
            <span>{label}</span>
            <input
              type="datetime-local"
              value={draft[key]}
              onChange={(event) => update(key, event.target.value)}
              className="h-9 w-full border border-foreground/15 bg-transparent px-2.5 text-xs text-foreground outline-none focus:border-primary"
            />
          </label>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-foreground/10 pt-3">
        <AdminButton
          type="button"
          variant="ghost"
          onClick={() => {
            setDraft(EMPTY_FILTERS);
            onClear();
          }}
          className="px-0"
        >
          clear
        </AdminButton>
        <AdminButton type="submit" variant="primary">
          apply
        </AdminButton>
      </div>
    </form>
  );
}

type TrackRecord = {
  id: string;
  visitorId: string;
  action: "view" | "insert" | "update" | "soft_delete" | "delete";
  path: string[];
  currentUrl: string;
  parameters: unknown | null;
  from: unknown | null;
  visitor: unknown | null;
  location: unknown | null;
  ip: string | null;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
};

const actionStyles: Record<TrackRecord["action"], string> = {
  view: "bg-blue-500/10 text-blue-500",
  insert: "bg-green-500/10 text-green-600",
  update: "bg-amber-500/10 text-amber-600",
  soft_delete: "bg-red-500/10 text-red-500",
  delete: "bg-red-500/10 text-red-500",
};
type TrackListResponse = {
  data: TrackRecord[];
  meta: { total: number; offset: number; limit: number; page: number };
};

export default function AnalyticsView() {
  const { setDashboardTitle, setRightPanel } = useDashboard();
  const { openModal, closeModal } = useModal();
  const deleteTracksModalId = "analytics-delete-tracks-confirm";
  const [trackPage, setTrackPage] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState<TrackRecord | null>(null);
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [bulkDeleteError, setBulkDeleteError] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const trackPageSize = 10;
  const query = new URLSearchParams({
    offset: String((trackPage - 1) * trackPageSize),
    limit: String(trackPageSize),
  });
  Object.entries(filters).forEach(([key, value]) => {
    if (!value.trim()) return;
    query.set(
      key,
      key === "timestampFrom" || key === "timestampTo"
        ? new Date(value).toISOString()
        : value.trim()
    );
  });
  const {
    data: trackData,
    isLoading: tracksLoading,
    error: tracksError,
    mutate: mutateTracks,
  } = useSWR<TrackListResponse>(`/track?${query.toString()}`, fetcher);

  const visibleTrackIds = trackData?.data.map((record) => record.id) ?? [];
  const allVisibleSelected = visibleTrackIds.length > 0 && visibleTrackIds.every((id) => selectedTrackIds.includes(id));

  const deleteSelectedTracks = async () => {
    if (!selectedTrackIds.length || isDeletingSelected) return;

    setIsDeletingSelected(true);
    setBulkDeleteError("");
    try {
      await fetcher<{ deletedCount: number }>("/track/bulk", {
        method: "DELETE",
        body: JSON.stringify({ ids: selectedTrackIds }),
      });
      setSelectedTrackIds([]);
      setTrackPage(1);
      await mutateTracks();
    } catch (cause) {
      setBulkDeleteError(cause instanceof Error ? cause.message : "Could not delete selected track records.");
    } finally {
      setIsDeletingSelected(false);
    }
  };

  useEffect(() => {
    setDashboardTitle("Analytics");
  }, [setDashboardTitle]);

  useEffect(() => {
    setRightPanel(
      <AnalyticsFilterPanel
        initialFilters={filters}
        onApply={(nextFilters) => {
          setFilters(nextFilters);
          setTrackPage(1);
        }}
        onClear={() => {
          setFilters(EMPTY_FILTERS);
          setTrackPage(1);
        }}
      />
    );
    return () => setRightPanel(null);
  }, [filters, setRightPanel]);

  const trackColumns: AdminListColumn<TrackRecord>[] = [
    {
      header: "Track",
      skeletonWidth: "w-64",
      cell: (record) => (
        <div className="min-w-0 space-y-2">
          <div className="flex min-w-0 items-center gap-3">
            <input
              type="checkbox"
              checked={selectedTrackIds.includes(record.id)}
              onChange={(event) => setSelectedTrackIds((current) => (
                event.target.checked
                  ? [...current, record.id]
                  : current.filter((id) => id !== record.id)
              ))}
              aria-label={`Select track record for /${record.path.join("/")}`}
              className="size-4 shrink-0 accent-primary"
            />
            <span className="shrink-0 font-mono text-sm text-foreground/75">/{record.path.join("/")}</span>
            <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] lowercase ${actionStyles[record.action]}`}>
              {record.action.replace("_", "-")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <time dateTime={record.timestamp} className="shrink-0 text-xs font-mono text-foreground/45">
              {formatDate(record.timestamp)}
            </time>
            <AdminButton
              type="button"
              variant="ghost"
              className="shrink-0 px-0 text-xs"
              onClick={() => {
                setSelectedTrack(record);
                openModal("analytics-track-log");
              }}
            >
              view log
            </AdminButton>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-6 p-6">
      <AdminPageHeader title="analytics" description="Recent activity from tracked public pages." />
      <section className="mx-auto w-full max-w-3xl space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-bold lowercase text-foreground/75">recent activity</h2>
          {selectedTrackIds.length > 0 && (
            <AdminButton
              type="button"
              variant="destructive"
              loading={isDeletingSelected}
              onClick={() => openModal(deleteTracksModalId)}
            >
              <span className="inline-flex items-center gap-2">
                <Trash2 aria-hidden="true" className="size-4" />
                delete selected ({selectedTrackIds.length})
              </span>
            </AdminButton>
          )}
        </div>
        {bulkDeleteError && (
          <p className="border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500" role="alert">
            {bulkDeleteError}
          </p>
        )}
        {!tracksError && !tracksLoading && visibleTrackIds.length > 0 && (
          <label className="flex w-fit items-center gap-2 text-xs text-foreground/50">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={(event) => setSelectedTrackIds((current) => {
                const otherPageIds = current.filter((id) => !visibleTrackIds.includes(id));
                return event.target.checked ? [...otherPageIds, ...visibleTrackIds] : otherPageIds;
              })}
              aria-label="Select all track records on this page"
              className="size-4 accent-primary"
            />
            select page
          </label>
        )}
        {tracksError ? (
          <p className="border-y border-foreground/10 py-8 text-center text-sm text-red-500/70">
            Track records could not be loaded.
          </p>
        ) : (
          <AdminList
            columns={trackColumns}
            data={trackData?.data ?? []}
            isLoading={tracksLoading}
            emptyMessage="No track records found."
            skeletonCount={10}
          />
        )}
        {!tracksError && (
          <Pagination
            total={trackData?.meta.total ?? 0}
            current={trackPage}
            pageSize={trackPageSize}
            onPageChange={setTrackPage}
            showTotal
          />
        )}
      </section>
      <Modal
        id={deleteTracksModalId}
        title="Confirm permanent deletion"
        size="sm"
        onClose={() => closeModal(deleteTracksModalId)}
        footer={(
          <div className="flex justify-end gap-2">
            <AdminButton type="button" onClick={() => closeModal(deleteTracksModalId)}>Cancel</AdminButton>
            <AdminButton
              type="button"
              variant="destructive"
              loading={isDeletingSelected}
              onClick={() => {
                closeModal(deleteTracksModalId);
                void deleteSelectedTracks();
              }}
            >
              Delete
            </AdminButton>
          </div>
        )}
      >
        <p className="text-sm text-foreground/65">
          Permanently delete {selectedTrackIds.length} selected track records? This action cannot be undone.
        </p>
      </Modal>
      <Modal
        id="analytics-track-log"
        title="Track log"
        size="xl"
        onClose={() => {
          closeModal("analytics-track-log");
          setSelectedTrack(null);
        }}
        footer={(
          <AdminButton
            type="button"
            variant="ghost"
            onClick={() => {
              closeModal("analytics-track-log");
              setSelectedTrack(null);
            }}
          >
            close
          </AdminButton>
        )}
      >
        {selectedTrack && (
          <pre className="max-h-[65vh] overflow-auto border border-foreground/10 bg-foreground/[0.03] p-4 text-xs leading-5 text-foreground/75">
            {JSON.stringify(selectedTrack, null, 2)}
          </pre>
        )}
      </Modal>
    </section>
  );
}
