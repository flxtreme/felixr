"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeModeToggle } from "@/src/components/ThemeModeToggle";
import { AdminSearchTrigger } from "@/src/layouts/parts/AdminSearch";
import { cln } from "@/src/utils/cln";

type NavigationItem = { id: string; href: string; label: string; exact?: boolean };
type NavigationGroup = { items: NavigationItem[] };

export function AdminMobileHeader({ navGroups, onSignOut, isScrolled }: { navGroups: NavigationGroup[]; onSignOut: () => void; isScrolled: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <div className={cln(
        "fixed z-50 flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden transition-all duration-200 xl:hidden",
        isScrolled || menuOpen
          ? "inset-x-4 top-3 rounded-2xl border border-foreground/10 bg-background/80 shadow-lg backdrop-blur-md"
          : "inset-x-0 top-0 rounded-none border border-transparent bg-transparent shadow-none backdrop-blur-0",
      )}>
        <header className={cln("flex h-16 shrink-0 items-center gap-3 px-6 transition-all duration-200", menuOpen && "border-b-0")}>
          <Link href="/" className="text-lg font-bold text-primary">felixr</Link>
          <div className="flex-1" />
          <ThemeModeToggle />
          <AdminSearchTrigger />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close admin navigation" : "Open admin navigation"}
            aria-expanded={menuOpen}
            aria-controls="admin-mobile-navigation"
            className="inline-flex size-8 items-center justify-center text-foreground/70 transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </header>
        <nav
          id="admin-mobile-navigation"
          aria-label="Admin navigation"
          aria-hidden={!menuOpen}
          className={cln(
            "overflow-y-auto transition-[max-height,opacity,transform,visibility] duration-300 ease-out",
            menuOpen ? "visible max-h-[calc(100dvh-6rem)] translate-y-0 opacity-100" : "invisible max-h-0 -translate-y-2 opacity-0",
          )}
        >
          <div className="flex flex-col py-4">
            {navGroups.map((group, groupIndex) => (
              <div key={group.items[0].id}>
                {groupIndex > 0 && <div aria-hidden="true" className="my-6 w-full border-t border-foreground/10" />}
                <div className="flex flex-col gap-1 px-6">
                  {group.items.map((item) => {
                    const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cln("flex min-h-8 items-center justify-start gap-3 text-sm lowercase underline underline-offset-3 transition-colors hover:text-primary", active ? "text-primary" : "text-foreground/65")}
                      >
                        <span>{item.label}</span>
                        {active && <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            <button type="button" onClick={onSignOut} className="mx-6 mt-6 min-h-8 w-fit text-sm lowercase text-foreground/65 underline underline-offset-3 hover:text-primary">
              logout
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
