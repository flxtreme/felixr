"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { cln } from "@/src/utils/cln";
import { useTheme } from "@/src/contexts/ThemeContext";

const navItems = [
  { label: "Projects", path: "/projects" },
  { label: "Posts", path: "/blog" },
  { label: "About", path: "/about" },
];

export const Header = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolledPast, setScrolledPast] = useState(false);
  const isLandingPage = pathname === "/" || pathname === "/home";
  const showNav = !isLandingPage || scrolledPast;

  useEffect(() => {
    if (!isLandingPage) return;

    const handleScroll = () => {
      setScrolledPast(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-3xl mx-auto w-full px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className={cln(
            "font-bold hover:text-primary transition-all active:scale-95",
            showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          )}
        >
          <span className="text-primary text-3xl">felixr</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav
            className={cln(
              "flex items-center gap-6 transition-all duration-300",
              showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            )}
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-current={isActive ? "page" : undefined}
                  className={cln(
                    "text-lg font-medium transition-all hover:text-primary hover:underline text-foreground/60",
                    isActive && "text-primary underline underline-offset-4"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={toggleTheme}
            className="p-2 transition-colors text-foreground/40 hover:text-primary"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
