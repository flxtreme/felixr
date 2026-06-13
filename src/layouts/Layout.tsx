import React from "react";
import { Header } from "@/src/layouts/parts/Header";
import { Footer } from "@/src/layouts/parts/Footer";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
