"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { cln } from "@/src/utils/cln";
import { navItems } from "@/src/config/nav";
import { IconButton, useFlxTheme } from "flxtheme";

export const Header = () => {
  const pathname = usePathname();
  const { mode, toggleMode } = useFlxTheme();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-transparent bg-background data-[scrolled=true]:border-border transition-colors duration-300">
      <div className="max-w-6xl mx-auto w-full px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold transition-all duration-300 hover:text-primary active:scale-95"
        >
          <span className="text-primary text-2xl tracking-tight">felixr</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Nav links */}
          <nav className="hidden items-center gap-5 sm:flex">
            {navItems.map((item) => {
              const isActive =
                pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

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
          <IconButton
            variant="ghost"
            size="sm"
            onClick={toggleMode}
            aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            icon={mode === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
