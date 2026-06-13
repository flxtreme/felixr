import React from "react";
import { cln } from "@/src/utils/cln";

interface SinglePageLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  headerClassName?: string;
}

export const SinglePageLayout = ({ header, children, headerClassName }: SinglePageLayoutProps) => {
  return (
    <div className="flex flex-col">
      <section className={cln("border-b border-border", headerClassName)}>
        <div className="max-w-3xl mx-auto px-6 py-12">{header}</div>
      </section>
      <section className="border-b border-border">
        <article className="max-w-3xl mx-auto px-6 py-12">{children}</article>
      </section>
    </div>
  );
};

export default SinglePageLayout;
