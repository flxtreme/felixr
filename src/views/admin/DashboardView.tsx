"use client";

import { useDashboard } from "@/src/features/admin/DashboardContext";
import { usePosts } from "@/src/features/admin/posts/hooks";
import { useProjects } from "@/src/features/admin/project/hooks";
import {
  LuArrowUpRight,
  LuEye,
  LuFileText,
  LuFolderKanban,
  LuLayoutPanelLeft,
} from "flxtheme/icons/lu";
import { useAnalytics } from "@/src/lib/analytics/useAnalytics";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/src/utils/fetcher";
import { formatDate } from "@/src/utils/date";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { AdminPageHeader } from "@/src/features/admin/components/AdminPageHeader";
import { WidgetQuickCreate } from "@/src/features/admin/components/WidgetQuickCreate";
import { SiGmail, SiGumroad } from "react-icons/si";

type TrackRecord = {
  id: string;
  action: "view" | "insert" | "update" | "soft_delete" | "delete" | "download" | "redirect";
  path: string[];
  timestamp: string;
};

const actionStyles: Record<TrackRecord["action"], string> = {
  view: "bg-blue-500/10 text-blue-500",
  insert: "bg-green-500/10 text-green-600",
  update: "bg-amber-500/10 text-amber-600",
  soft_delete: "bg-red-500/10 text-red-500",
  delete: "bg-red-500/10 text-red-500",
  download: "bg-purple-500/10 text-purple-500",
  redirect: "bg-cyan-500/10 text-cyan-500",
};

const panelClass = "flex h-full flex-col rounded border border-border";
const panelHeaderClass =
  "flex h-14 shrink-0 items-center justify-between border-b border-dashed border-foreground/15 px-5";
const panelTitleClass = "text-xs font-mono font-medium text-foreground/40 uppercase tracking-wide";

export default function DashboardView() {
  const router = useRouter();
  const { user, setDashboardTitle, setRightPanel } = useDashboard();
  useAnalytics();

  const { posts, meta: postsMeta, isLoading: postsLoading } = usePosts({
    postType: "POST",
    limit: 5,
  });
  const { meta: pagesMeta } = usePosts({ postType: "PAGE", limit: 1 });
  const { meta: projectsMeta } = useProjects({ limit: 1, offset: 0, search: "" });

  const { data: trackData, isLoading: tracksLoading, error: tracksError } = useSWR<{
    data: TrackRecord[];
  }>("/track?offset=0&limit=5", fetcher);
  const tracks = trackData?.data ?? [];
  const { data: viewsData } = useSWR<{ meta: { total: number } }>(
    "/track?action=view&offset=0&limit=1",
    fetcher
  );

  useEffect(() => {
    setDashboardTitle("Overview");
  }, [setDashboardTitle]);

  useEffect(() => {
    setRightPanel(<WidgetQuickCreate />);
    return () => setRightPanel(null);
  }, [setRightPanel]);

  const stats = [
    { label: "Posts", value: postsMeta?.total ?? "—", icon: LuFileText, href: "/admin/posts" },
    { label: "Pages", value: pagesMeta?.total ?? "—", icon: LuLayoutPanelLeft, href: "/admin/pages" },
    { label: "Projects", value: projectsMeta?.total ?? "—", icon: LuFolderKanban, href: "/admin/projects" },
    { label: "Errors", value: "0", icon: SiGmail, href: "/admin/logs?type=error" }
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-6">
      <AdminPageHeader title="overview">
        <p className="text-sm font-mono font-medium text-foreground/40">
          Welcome back, <span className="text-foreground/70">{user?.name}</span> — here&apos;s what&apos;s
          happening.
        </p>
      </AdminPageHeader>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group flex h-32 flex-col justify-between rounded border border-border p-5 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <span className={panelTitleClass}>{stat.label}</span>
                <Icon className="h-4 w-4 text-foreground/30 transition-colors group-hover:text-primary" />
              </div>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
            </Link>
          );
        })}
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        {/* Recent posts */}
        <div className={panelClass}>
          <div className={panelHeaderClass}>
            <h2 className={panelTitleClass}>Recent posts</h2>
            <AdminButton variant="ghost" size="sm" onClick={() => router.push("/admin/posts")}>
              View all
              <LuArrowUpRight className="ml-1 h-3 w-3" />
            </AdminButton>
          </div>

          <div className="flex-1 divide-y divide-dashed divide-foreground/15">
            {postsLoading && (
              <p className="px-5 py-4 text-xs font-mono font-medium text-foreground/40">Loading…</p>
            )}
            {!postsLoading && posts.length === 0 && (
              <p className="px-5 py-4 text-xs font-mono font-medium text-foreground/40">No posts yet.</p>
            )}
            {posts.map((post) => (
              <div key={post.id} className="group flex h-16 items-center justify-between gap-4 px-5">
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                    {post.title}
                  </p>
                  <p className="text-xs font-mono font-medium text-foreground/40">
                    {post.status} · {formatDate(post.publishedAt ?? post.createdAt)}
                  </p>
                </div>
                <AdminButton
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  onClick={() => router.push(`/admin/posts/${post.id}`)}
                >
                  Edit
                </AdminButton>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity (logs) */}
        <div className={panelClass}>
          <div className={panelHeaderClass}>
            <h2 className={panelTitleClass}>Recent activity</h2>
            <AdminButton variant="ghost" size="sm" onClick={() => router.push("/admin/analytics")}>
              View all
              <LuArrowUpRight className="ml-1 h-3 w-3" />
            </AdminButton>
          </div>

          <div className="flex-1 divide-y divide-dashed divide-foreground/15">
            {tracksLoading && (
              <p className="px-5 py-4 text-xs font-mono font-medium text-foreground/40">Loading…</p>
            )}
            {tracksError && (
              <p className="px-5 py-4 text-xs font-mono font-medium text-red-500/70">
                Logs could not be loaded.
              </p>
            )}
            {!tracksLoading && !tracksError && tracks.length === 0 && (
              <p className="px-5 py-4 text-xs font-mono font-medium text-foreground/40">No activity yet.</p>
            )}
            {tracks.map((record) => (
              <div key={record.id} className="flex h-16 items-center justify-between gap-4 px-5">
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate font-mono text-sm text-foreground/75">
                    /{record.path.join("/")}
                  </p>
                  <time
                    dateTime={record.timestamp}
                    className="text-xs font-mono font-medium text-foreground/40"
                  >
                    {formatDate(record.timestamp)}
                  </time>
                </div>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] lowercase ${actionStyles[record.action]}`}
                >
                  {record.action.replace("_", "-")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}