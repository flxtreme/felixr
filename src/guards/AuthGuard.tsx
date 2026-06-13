"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/src/utils/session";

interface AuthContextType {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const verify = () => {
      console.log("verify called");
      const token = getSession("accessToken");
      console.log("token:", token);
      if (!token) {
        setStatus("unauthenticated");
        router.replace("/login");
      } else {
        setStatus("authenticated");
      }
    };

    console.log("useEffect fired");
    verify();

    window.addEventListener("pageshow", verify);
    window.addEventListener("focus", verify);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") verify();
    });

    return () => {
      window.removeEventListener("pageshow", verify);
      window.removeEventListener("focus", verify);
    };
  }, [router]);

  if (status === "loading") return null;
  if (status === "unauthenticated") return null;

  return <AuthContext.Provider value={{ isAuthenticated: true }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthGuard");
  }
  return context;
};
