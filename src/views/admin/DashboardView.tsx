"use client";

import { useDashboard } from "@/src/features/admin/DashboardContext";
import { Clock, Eye, FileText, LayoutPanelLeft } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Posts", value: "12", icon: FileText, href: "/admin/posts" },
  { label: "Total Pages", value: "4", icon: LayoutPanelLeft, href: "/admin/pages" },
  { label: "Views (30d)", value: "1.2k", icon: Eye },
  { label: "Uptime", value: "99.9%", icon: Clock },
];

export default function DashboardView() {
  const { user } = useDashboard();

  return (
    <div className="p-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm font-mono font-medium text-foreground/40">
          Welcome back, <span className="font-medium">{user?.name}</span>
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <div className="bg-surface shadow-sm rounded-lg p-6 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-medium text-foreground/40">
                  {stat.label}
                </span>
                <Icon className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          );

          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {content}
            </Link>
          ) : (
            <div key={stat.label}>{content}</div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-surface shadow-sm rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-mono font-bold text-foreground/40">Recent Posts</h2>
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-4 flex items-center justify-between group">
                <div className="space-y-1">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors cursor-default">
                    How to scale Node.js microservices
                  </p>
                  <p className="text-xs font-mono font-medium text-foreground/40">
                    Published · May 24, 2024
                  </p>
                </div>
                <Link
                  href="/admin/posts/edit"
                  className="text-xs font-mono font-medium text-foreground/30 hover:text-primary transition-colors"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface shadow-sm rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-mono font-bold text-foreground/40">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/admin/posts/new"
              className="flex items-center justify-between p-4 border border-dashed border-border rounded-lg text-sm font-mono font-medium text-foreground/40 hover:border-primary hover:text-primary transition-all"
            >
              <span>Create new post</span>
              <span>+</span>
            </Link>
            <Link
              href="/admin/pages/new"
              className="flex items-center justify-between p-4 border border-dashed border-border rounded-lg text-sm font-mono font-medium text-foreground/40 hover:border-primary hover:text-primary transition-all"
            >
              <span>Create new page</span>
              <span>+</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
