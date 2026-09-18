"use client";

import { useDashboard } from "@/src/features/admin/DashboardContext";
import { usePosts } from "@/src/features/admin/posts/hooks";
import { useProjects } from "@/src/features/admin/project/hooks";
import { Card, CardHeader, CardBody, Button } from "flxtheme";
import {
  LuArrowUpRight,
  LuEye,
  LuFileText,
  LuFolderKanban,
  LuLayoutPanelLeft,
  LuPlus,
} from "flxtheme/icons/lu";
import { useAnalytics } from "@/src/lib/analytics/useAnalytics";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardView() {
  const router = useRouter();
  const { user, setDashboardTitle } = useDashboard();
  useAnalytics();

  const { posts, meta: postsMeta, isLoading: postsLoading } = usePosts({
    postType: "POST",
    limit: 3,
  });
  const { meta: pagesMeta } = usePosts({ postType: "PAGE", limit: 1 });
  const { meta: projectsMeta } = useProjects({ limit: 1, offset: 0, search: "" });

  useEffect(() => {
    setDashboardTitle("Overview");
  }, [setDashboardTitle]);

  const stats = [
    {
      label: "Total Posts",
      value: postsMeta?.total ?? "—",
      icon: LuFileText,
      href: "/admin/posts",
    },
    {
      label: "Total Pages",
      value: pagesMeta?.total ?? "—",
      icon: LuLayoutPanelLeft,
      href: "/admin/pages",
    },
    {
      label: "Total Projects",
      value: projectsMeta?.total ?? "—",
      icon: LuFolderKanban,
      href: "/admin/projects",
    },
    { label: "Views (30d)", value: "1.2k", icon: LuEye },
  ];

  return (
    <div className="p-6 space-y-8">
      <header>
        <p className="text-sm font-mono font-medium text-foreground/40">
          Welcome back, <span className="text-foreground/70 font-medium">{user?.name}</span> — here&apos;s what&apos;s happening.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="hover:shadow-md transition-all group cursor-pointer"
              onClick={stat.href ? () => router.push(stat.href) : undefined}
            >
              <CardBody className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-medium text-foreground/40 uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <div className="p-2 rounded-lg bg-foreground/5 group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              </CardBody>
            </Card>
          );
        })}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold text-foreground/40 uppercase tracking-wide">
              Recent Posts
            </h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/posts")}>
              View all
              <LuArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardBody className="divide-y divide-border">
            {postsLoading && (
              <p className="py-4 text-xs font-mono font-medium text-foreground/40">Loading…</p>
            )}
            {!postsLoading && posts.length === 0 && (
              <p className="py-4 text-xs font-mono font-medium text-foreground/40">No posts yet.</p>
            )}
            {posts.map((post) => (
              <div key={post.id} className="py-4 flex items-center justify-between group">
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                    {post.title}
                  </p>
                  <p className="text-xs font-mono font-medium text-foreground/40">
                    {post.status} · {post.publishedAt ?? post.createdAt}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 ml-4"
                  onClick={() => router.push(`/admin/posts/${post.id}`)}
                >
                  Edit
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-mono font-bold text-foreground/40 uppercase tracking-wide">
              Quick Actions
            </h2>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="justify-between border-dashed"
              onClick={() => router.push("/admin/posts/new")}
            >
              <span>Create new post</span>
            </Button>
            <Button
              variant="outline"
              className="justify-between border-dashed"
              onClick={() => router.push("/admin/pages/new")}
            >
              <span>Create new page</span>
            </Button>
            <Button
              variant="outline"
              className="justify-between border-dashed"
              onClick={() => router.push("/admin/projects/new")}
            >
              <span>Create new project</span>
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}