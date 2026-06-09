"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useDashboard } from "@/src/features/admin/DashboardContext";
import { useAuthActions } from "@/src/features/auth/hooks";
import { Plus, LayoutPanelLeft, FileText, LogOut, Sun, Moon, LayoutDashboard, Tag, ChevronDown } from "lucide-react";
import { cln } from "@/src/utils/cln";
import { useTheme } from "@/src/contexts/ThemeContext";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useDashboard();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuthActions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="h-10 border-b border-border bg-background/95 backdrop-blur shrink-0">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="text-primary">felixr</span>
              <span className="text-foreground/20 font-mono font-medium text-sm">|</span>
              <span className="text-sm font-mono font-medium text-foreground/40">Admin</span>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-sm font-mono font-medium text-foreground/40 hover:text-primary flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                New <ChevronDown className={cln("w-3 h-3 transition-transform", isDropdownOpen && "rotate-180")} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-32 bg-background border border-border rounded-md shadow-lg z-10">
                  <Link
                    href="/admin/posts/new"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    Post
                  </Link>
                  <Link
                    href="/admin/pages/new"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    Page
                  </Link>
                  <Link
                    href="/admin/tags/new"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    Tag
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className={cln(
                "p-1.5 transition-colors hover:text-primary",
                theme === 'light' ? 'text-primary' : 'text-amber-500'
              )}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            <span className="text-sm font-mono font-medium text-foreground/60">{user?.name}</span>
            <button 
              onClick={signOut}
              className="text-sm font-mono font-medium text-foreground/40 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-48 border-r border-border flex flex-col p-4 gap-2 shrink-0">
          <nav className="flex flex-col gap-1">
            <Link 
              href="/admin" 
              className="flex items-center gap-4 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10 hover:text-primary transition-all text-foreground/60"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link 
              href="/admin/pages" 
              className="flex items-center gap-4 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10 hover:text-primary transition-all text-foreground/60"
            >
              <LayoutPanelLeft className="w-3.5 h-3.5" />
              Pages
            </Link>
            <Link 
              href="/admin/posts" 
              className="flex items-center gap-4 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10 hover:text-primary transition-all text-foreground/60"
            >
              <FileText className="w-3.5 h-3.5" />
              Posts
            </Link>
            <Link 
              href="/admin/tags" 
              className="flex items-center gap-4 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10 hover:text-primary transition-all text-foreground/60"
            >
              <Tag className="w-3.5 h-3.5" />
              Tags
            </Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <div className="w-48 border-l border-border shrink-0" />
      </div>
    </div>
  );
};

export default DashboardLayout;
