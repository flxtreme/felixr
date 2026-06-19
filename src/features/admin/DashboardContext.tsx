"use client";

import { createContext, useContext, useState } from "react";

interface DashboardContextType {
  user: { name: string; email: string } | null;
}

interface DashboardContextType {
  user: { name: string; email: string } | null;
  goBackUrl?: string;
  setGoBackUrl: (url?: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user] = useState({ name: "felixr", email: "flxrzjr@gmail.com" });

  const [goBackUrl, setGoBackUrl] = useState<string | undefined>(undefined);
 
  return <DashboardContext.Provider value={{ user, goBackUrl, setGoBackUrl }}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardContextProvider");
  }
  return context;
};
