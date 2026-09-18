"use client";

import { useEffect, useRef } from "react";
import { FlxTheme, ModalProvider, useFlxTheme } from "flxtheme";
import { ErrorBoundary } from "../contexts/ErrorBoundary";
import { GlobalErrorHandler } from "../contexts/GlobalErrorHandler";

function ThemePersistence() {
  const { mode, setMode } = useFlxTheme();
  const initialized = useRef(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setMode(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    }
  }, [setMode]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    window.localStorage.setItem("theme", mode);
  }, [mode]);

  return null;
}

export default function FelixrLayout({ children }: { children: React.ReactNode }) {
  return (
    <FlxTheme>
      <ThemePersistence />
      <ModalProvider>
        <GlobalErrorHandler />
        <ErrorBoundary>{children}</ErrorBoundary>
      </ModalProvider>
    </FlxTheme>
  );
}
