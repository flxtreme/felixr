import React from "react";
import { cln } from "@/src/utils/cln";

interface PageLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
  headerClassName?: string;
}

export const PageLayout = ({
  title,
  children,
  headerClassName,
}: PageLayoutProps) => {
  return (
    <div className="flex flex-col">
      <section className={cln("border-b border-border", headerClassName)}>
        <div className="max-w-3xl mx-auto px-6 py-12">{title}</div>
      </section>
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">{children}</div>
      </section>
    </div>
  );
};

export default PageLayout;
