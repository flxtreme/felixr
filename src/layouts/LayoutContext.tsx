"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type LayoutContextValue = {
  rightPanel: ReactNode;
  setRightPanel: (content: ReactNode) => void;
};

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [rightPanel, setRightPanel] = useState<ReactNode>(null);

  return (
    <LayoutContext.Provider value={{ rightPanel, setRightPanel }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutProvider");
  return context;
}
