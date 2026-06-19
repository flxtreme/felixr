"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useDashboard } from "@/src/features/admin/DashboardContext";
import { useAuthActions } from "@/src/features/auth/hooks";
import {
  Plus,
  FileText,
  LogOut,
  Sun,
  Moon,
  LayoutDashboard,
  LayoutPanelLeft,
  Tag,
  ChevronDown,
  Globe2,
  ArrowLeft,
} from "lucide-react";
import { cln } from "@/src/utils/cln";
import { useTheme } from "@/src/contexts/ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../components/Button";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/projects", icon: Globe2, label: "Projects" },
  { href: "/admin/pages", icon: LayoutPanelLeft, label: "Pages" },
  { href: "/admin/posts", icon: FileText, label: "Posts" },
  { href: "/admin/tags", icon: Tag, label: "Tags" },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, goBackUrl, setGoBackUrl } = useDashboard();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuthActions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">

      {!isFullScreen && (
        <aside className="w-24 h-full bg-surface border-r border-border flex flex-col items-center py-5 gap-0 shrink-0 z-20">

          {/* Logo */}
          <Link
            href="/admin"
            className="text-primary font-bold text-3xl leading-none mb-8 hover:opacity-80 transition-opacity"
          >
            fr
          </Link>

          {/* Nav */}
          <nav className="flex flex-col items-center gap-1 w-full flex-1">
            {navItems.map(({ href, icon: Icon, label, exact }) => {
              const isActive = exact
                ? pathname === href || pathname === "/admin/dashboard"
                : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cln(
                    "flex flex-col items-center gap-1 w-full py-3 px-1 transition-all",
                    isActive
                      ? "text-primary"
                      : "text-foreground/40 hover:text-primary"
                  )}
                >
                  <Icon className="size-6" />
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom: logout */}
          <button
            onClick={signOut}
            className="flex flex-col items-center gap-1 text-foreground/40 hover:text-red-500 transition-colors py-2 w-full"
            aria-label="Logout"
          >
            <LogOut className="size-6" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>

        </aside>
      )}

      {/* Right side: header + main */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Toolbar header */}
        <header className="h-16 bg-surface border-b border-border shrink-0 z-10 flex items-center justify-between px-5">
          {goBackUrl && (
            <Button
              variant="tertiary"
              size="sm"
              onClick={handleGoBack}
            >
              <ArrowLeft className="size-5" />
            </Button>
          )}
          {/* New dropdown */}
          <div className={cln("relative", goBackUrl && "ml-2 flex-1")} ref={dropdownRef}>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>New</span>
              <ChevronDown
                className={cln("ml-2 w-4 h-4 transition-transform", isDropdownOpen && "rotate-180")}
              />
            </Button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-36 bg-surface border border-border rounded-lg shadow-sm z-10">
                <Link
                  href="/admin/posts/new"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors rounded-t-lg"
                >
                  Post
                </Link>
                <Link
                  href="/admin/projects/new"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  Project
                </Link>
                <Link
                  href="/admin/pages/new"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  Page
                </Link>
                <Link
                  href="/admin/tags/new"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors rounded-b-lg"
                >
                  Tag
                </Link>
              </div>
            )}
          </div>

          {/* Right: user + theme */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono font-medium text-foreground/50">{user?.name}</span>
            <Button
              variant="tertiary"
              size="sm"
              square
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </Button>
          </div>

        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;