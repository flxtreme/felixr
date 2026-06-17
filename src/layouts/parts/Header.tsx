"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { cln } from "@/src/utils/cln";
import { useTheme } from "@/src/contexts/ThemeContext";
import { navItems } from "@/src/config/nav";

export const Header = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolledPast, setScrolledPast] = useState(false);
  const isLandingPage = pathname === "/" || pathname === "/home";
  const showNav = !isLandingPage || scrolledPast;

  useEffect(() => {
    if (!isLandingPage) return;
    const handleScroll = () => setScrolledPast(window.scrollY > 260);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-transparent data-[scrolled=true]:border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="max-w-3xl mx-auto w-full px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          className={cln(
            "font-bold transition-all duration-300 hover:text-primary active:scale-95",
            showNav
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1 pointer-events-none"
          )}
        >
          <span className="text-primary text-2xl tracking-tight">felixr</span>
        </Link>

        <div className="flex items-center gap-5">
          {/* Nav links */}
          <nav
            className={cln(
              "flex items-center gap-5 transition-all duration-300",
              showNav
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1 pointer-events-none"
            )}
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.path ||
                (item.path !== "/" && pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-current={isActive ? "page" : undefined}
                  className={cln(
                    "text-sm font-semibold transition-all hover:text-primary",
                    isActive
                      ? "text-primary underline underline-offset-4"
                      : "text-foreground/50 hover:underline underline-offset-4"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-foreground/40 hover:text-primary hover:bg-foreground/5 transition-all"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;