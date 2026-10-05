"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/src/features/admin/DashboardContext";
import { useAuthActions } from "@/src/features/auth/hooks";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeModeToggle } from "@/src/components/ThemeModeToggle";
import { AdminSearchProvider, AdminSearchTrigger } from "@/src/layouts/parts/AdminSearch";
import { AdminMobileHeader } from "@/src/layouts/parts/AdminMobileHeader";
import { AdminMobilePanel } from "@/src/layouts/parts/AdminMobilePanel";
import { cln } from "@/src/utils/cln";

const NAV_GROUPS = [
  {
    items: [
      { id: "overview", href: "/admin", label: "Overview", exact: true },
      { id: "analytics", href: "/admin/analytics", label: "Analytics" },
    ],
  },
  {
    items: [
      { id: "pages", href: "/admin/pages", label: "Pages" },
      { id: "posts", href: "/admin/posts", label: "Posts" },
      { id: "tags", href: "/admin/tags", label: "Tags" },
    ],
  },
  {
    items: [
      { id: "projects", href: "/admin/projects", label: "Projects" },
      { id: "shop", href: "/admin/shop", label: "Shop" },
      { id: "uploads", href: "/admin/uploads", label: "Uploads" },
      { id: "stacks", href: "/admin/stacks", label: "Stacks" },
      { id: "gigs", href: "/admin/gigs", label: "Gigs" },
      { id: "certifications", href: "/admin/certifications", label: "Certifications" },
      { id: "trainings", href: "/admin/trainings", label: "Trainings" },
    ],
  },
  {
    items: [
      { id: "users", href: "/admin/users", label: "Users" },
    ],
  },
];

const DashboardLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { goBackUrl, setGoBackUrl, rightPanel } = useDashboard();
  const { signOut } = useAuthActions();
  const pathname = usePathname();
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const updateScrollState = () => setIsScrolled(main.scrollTop > 0);
    updateScrollState();
    main.addEventListener("scroll", updateScrollState, { passive: true });
    return () => main.removeEventListener("scroll", updateScrollState);
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
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      <div aria-hidden="true" className="hero-dot-grid pointer-events-none absolute inset-0" />
      {!isFullScreen && <AdminMobileHeader navGroups={NAV_GROUPS} onSignOut={signOut} isScrolled={isScrolled} />}
      {!isFullScreen && (
        <aside className="relative z-10 hidden h-full w-72 shrink-0 flex-col gap-10 overflow-y-auto border-r border-dashed border-foreground/10 bg-transparent xl:flex">
          <div className="flex items-center justify-between gap-3 px-6 pt-10 xl:px-8">
            <Link href="/" className="text-lg font-bold text-primary">
              felixr
            </Link>
          </div>
          <nav aria-label="Admin navigation" className="flex w-full flex-1 flex-col pt-4 xl:pt-0">
            {NAV_GROUPS.map((group, index) => (
              <React.Fragment key={group.items[0].id}>
                {index > 0 && <div aria-hidden="true" className="my-6 w-full border-t border-foreground/10" />}
                <div className="flex flex-col gap-1 px-6 xl:px-8">
                  {group.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      aria-current={isActive(item.href, item.exact) ? "page" : undefined}
                      className={`flex min-h-8 items-center justify-start gap-3 text-sm lowercase underline underline-offset-3 transition-colors hover:text-primary ${isActive(item.href, item.exact) ? "text-primary" : "text-foreground/65"}`}
                    >
                      <span>{item.label}</span>
                      {isActive(item.href, item.exact) && <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />}
                    </Link>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </nav>
          <button
            type="button"
            onClick={signOut}
            className="mt-auto flex min-h-8 items-center justify-start gap-3 px-6 pb-8 text-sm lowercase text-foreground/65 underline underline-offset-3 transition-colors hover:text-primary xl:px-8"
          >
            logout
          </button>
        </aside>
      )}

      <main ref={mainRef} className={cln(
        "relative z-10 flex min-w-0 flex-1 flex-col overflow-y-auto bg-transparent",
        !isFullScreen && "pt-20 xl:pt-0",
        "pb-20 xl:pb-0",
      )}>
        {children}
      </main>

      {!isFullScreen && (
        <aside aria-label="Admin side panel" className="relative z-10 hidden h-full w-72 shrink-0 flex-col overflow-y-auto border-l border-dashed border-foreground/10 bg-transparent xl:flex">
          <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-dashed border-foreground/10 pr-6 pl-4">
            <AdminSearchTrigger />
            <ThemeModeToggle />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{rightPanel}</div>
        </aside>
      )}
      <AdminMobilePanel>{rightPanel}</AdminMobilePanel>
    </div>
  );
};

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <AdminSearchProvider>
    <DashboardLayoutContent>{children}</DashboardLayoutContent>
  </AdminSearchProvider>
);

export default DashboardLayout;
