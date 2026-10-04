"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Footer } from "@/src/layouts/parts/Footer";
import { NavigationSidebar } from "@/src/layouts/parts/NavigationSidebar";
import { useLayout } from "@/src/layouts/LayoutContext";
import { ThemeModeToggle } from "@/src/components/ThemeModeToggle";
import { MobileHeader } from "@/src/layouts/parts/MobileHeader";
import { ScrollProgress } from "@/src/components/ScrollProgress";
import { GlobalSearch, SearchTrigger } from "@/src/layouts/parts/GlobalSearch";

export function LayoutFrame({ children }: { children: ReactNode }) {
  const { rightPanel } = useLayout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <GlobalSearch>
    <div className="relative isolate grid min-h-screen grid-cols-1 text-foreground xl:grid-cols-[18rem_minmax(0,1fr)_18rem]">
      <ScrollProgress />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--color-foreground) 14%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <NavigationSidebar
        mobileOpen={mobileMenuOpen}
        onMobileNavigate={() => setMobileMenuOpen(false)}
      />
      <div className="relative z-10 flex min-h-screen min-w-0 flex-col xl:col-start-2">
        <MobileHeader
          menuOpen={mobileMenuOpen}
          onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        />
        <div aria-hidden="true" className="h-16 shrink-0 xl:hidden" />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
      <aside
        aria-label="Page side panel"
        className="sticky top-0 z-10 hidden h-screen w-72 border-l border-dashed border-foreground/10 xl:col-start-3 xl:block"
      >
        <div className="flex items-center justify-between pl-2 pr-6 pt-0 pb-0 h-12 border-b border-foreground/10 border-dashed">
          <SearchTrigger />
          <ThemeModeToggle />
        </div>
        {rightPanel}
      </aside>
    </div>
    </GlobalSearch>
  );
}
