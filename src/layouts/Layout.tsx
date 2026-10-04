import type { ReactNode } from "react";
import { LayoutProvider } from "@/src/layouts/LayoutContext";
import { LayoutFrame } from "@/src/layouts/LayoutFrame";

export const Layout = ({ children }: { children: ReactNode }) => (
  <LayoutProvider>
    <LayoutFrame>{children}</LayoutFrame>
  </LayoutProvider>
);

export default Layout;
