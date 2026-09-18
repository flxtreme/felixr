"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/src/features/admin/DashboardContext";
import { useAuthActions } from "@/src/features/auth/hooks";
import {
  Sidebar, Header, Menu, MenuItem, Button, IconButton, Dropdown, DropdownItem, DropdownDivider,
  Tooltip, Accordion, useFlxTheme,
} from "flxtheme";
import {
  LogOut,
  Sun,
  Moon,
  LayoutDashboard,
  BarChart2,
  LayoutPanelLeft,
  FileText,
  Tag,
  Globe2,
  Sparkles,
  Users,
  Settings,
  ChevronDown,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const NAV_GROUPS = [
  {
    title: "Dashboard",
    expand: true,
    items: [
      { id: "overview", href: "/admin", label: "Overview", icon: <LayoutDashboard />, exact: true },
      { id: "analytics", href: "/admin/analytics", label: "Analytics", icon: <BarChart2 /> },
    ],
  },
  {
    title: "Blogging",
    expand: true,
    items: [
      { id: "pages", href: "/admin/pages", label: "Pages", icon: <LayoutPanelLeft /> },
      { id: "posts", href: "/admin/posts", label: "Posts", icon: <FileText /> },
      { id: "tags", href: "/admin/tags", label: "Tags", icon: <Tag /> },
    ],
  },
  {
    title: "Portfolio",
    expand: false,
    items: [
      { id: "projects", href: "/admin/projects", label: "Projects", icon: <Globe2 /> },
      { id: "skills", href: "/admin/skills", label: "Skills", icon: <Sparkles /> },
    ],
  },
  {
    title: "Settings",
    expand: false,
    items: [
      { id: "users", href: "/admin/users", label: "Users", icon: <Users /> },
      { id: "configs", href: "/admin/configs", label: "Configs", icon: <Settings /> },
    ],
  },
];

const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, goBackUrl, setGoBackUrl, title } = useDashboard();
  const { mode: theme, toggleMode: toggleTheme } = useFlxTheme();
  const { signOut } = useAuthActions();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isFullScreen =
    pathname.includes("/posts/new") ||
    pathname.includes("/pages/new") ||
    pathname.includes("/projects/new") ||
    (pathname.match(/\/posts\/[^/]+$/) && !pathname.endsWith("/posts")) ||
    (pathname.match(/\/pages\/[^/]+$/) && !pathname.endsWith("/pages")) ||
    (pathname.match(/\/projects\/[^/]+$/) && !pathname.endsWith("/projects"));

  const handleGoBack = () => {
    setGoBackUrl(undefined);
    router.push(goBackUrl || "/admin");
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {!isFullScreen && (
        <Sidebar
          collapsed={navCollapsed}
          onCollapsedChange={setNavCollapsed}
          title={
            <h3 className="text-2xl">felixr</h3>
          }
          className="h-full shrink-0 shadow flex flex-col"
        >
          <AnimatePresence mode="wait">
            {navCollapsed ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {NAV_GROUPS.map((group, gi) => (
                  <div key={group.title}>
                    <div className="relative h-11 flex items-center">
                      <div className="h-0.5 w-full bg-border rounded-full" />
                    </div>
                    <Menu orientation="vertical">
                      {group.items.map((s) => (
                        <Tooltip key={s.id} content={s.label} side="right">
                          <MenuItem
                            icon={s.icon}
                            active={isActive(s.href, s.exact)}
                            onClick={() => router.push(s.href)}
                            aria-label={s.label}
                            className="py-1"
                          />
                        </Tooltip>
                      ))}
                    </Menu>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Accordion
                  bordered={false}
                  type="multiple"
                  defaultOpen={NAV_GROUPS.filter((g) => g.expand).map((g) => g.title)}
                  items={NAV_GROUPS.map((group) => ({
                    id: group.title,
                    title: group.title,
                    content: (
                      <Menu orientation="vertical">
                        {group.items.map((s) => (
                          <MenuItem
                            key={s.id}
                            icon={s.icon}
                            active={isActive(s.href, s.exact)}
                            onClick={() => router.push(s.href)}
                            aria-label={s.label}
                            className="py-1"
                          >
                            <span>{s.label}</span>
                          </MenuItem>
                        ))}
                      </Menu>
                    ),
                  }))}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1" />

          <AnimatePresence mode="wait">
            {navCollapsed ? (
              <motion.div key="logout-collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <Menu orientation="vertical">
                  <Tooltip content="Logout" side="right">
                    <MenuItem
                      icon={<LogOut />}
                      onClick={signOut}
                      aria-label="Logout"
                      className="py-1"
                    />
                  </Tooltip>
                </Menu>
              </motion.div>
            ) : (
              <motion.div key="logout-expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <Menu orientation="vertical">
                  <MenuItem
                    icon={<LogOut />}
                    onClick={signOut}
                    aria-label="Logout"
                    className="py-1"
                  >
                    <span>Logout</span>
                  </MenuItem>
                </Menu>
              </motion.div>
            )}
          </AnimatePresence>
        </Sidebar>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          sticky={false}
          logo={
            <div className="flex items-center gap-2 relative">
              {navCollapsed && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="header-title"
                    className="overflow-hidden"
                    initial={{ width: "0px", opacity: 0 }}
                    animate={{ width: "100px", opacity: 1 }}
                    exit={{ width: "0px", opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl">felixr</h3>
                  </motion.div>
                </AnimatePresence>
              )}
              <AnimatePresence mode="wait">
                {goBackUrl && (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconButton icon={<ArrowLeft className="size-6" />} className="rounded-full" onClick={handleGoBack} aria-label="Go back" />
                  </motion.div>
                )}
              </AnimatePresence>
              <Dropdown
                trigger={
                  <Button>
                    New
                  </Button>
                }
              >
                <DropdownItem className="font-medium" onClick={() => router.push("/admin/posts/new")}>Post</DropdownItem>
                <DropdownItem className="font-medium" onClick={() => router.push("/admin/projects/new")}>Project</DropdownItem>
                <DropdownItem className="font-medium" onClick={() => router.push("/admin/pages/new")}>Page</DropdownItem>
                <DropdownDivider />
                <DropdownItem className="font-medium" onClick={() => router.push("/admin/tags/new")}>Tag</DropdownItem>
              </Dropdown>
            </div>
          }
          actions={
            <>
              <span className="text-sm font-mono font-medium text-foreground/50">{user?.name}</span>
              <Tooltip content={`Switch to ${theme === "light" ? "dark" : "light"} mode`} side="bottom">
                <IconButton
                  variant="ghost"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                  icon={theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
                />
              </Tooltip>
            </>
          }
          className="shadow"
        />
        <div className="h-12 flex items-center justify-start px-6 w-full bg-surface border-b border-border/50">
          <span className="font-medium">{title}</span>
        </div>

        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;