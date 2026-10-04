"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeModeToggle } from "@/src/components/ThemeModeToggle";
import { cln } from "@/src/utils/cln";

export function MobileHeader({ menuOpen, onMenuToggle }: {
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const isFloating = isScrolled || menuOpen;

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 0);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header
      className={cln(
        "fixed z-50 flex h-16 items-center gap-4 border px-6 transition-all duration-200 xl:hidden",
        menuOpen
          ? "inset-x-4 top-3 rounded-t-2xl rounded-b-none border-b-0 border-foreground/10 bg-background/80 shadow-none backdrop-blur-md"
          : isFloating
            ? "inset-x-4 top-3 rounded-2xl border-foreground/10 bg-background/80 shadow-lg backdrop-blur-md"
            : "inset-x-0 top-0 rounded-none border-transparent bg-transparent shadow-none backdrop-blur-0"
      )}
    >
      <Link href="/" className="text-lg font-bold text-primary">
        felixr
      </Link>
      <div className="flex-1" />
      <ThemeModeToggle />
      <button
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={onMenuToggle}
        className="inline-flex size-8 items-center justify-center text-foreground/70 transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>
    </header>
  );
}
