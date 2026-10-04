"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { PageHeader } from "@/src/components/PageHeader";
import { SectionDivider } from "@/src/components/SectionDivider";

type PageNotFoundProps = {
  slug?: string;
};

export function PageNotFound({ slug }: PageNotFoundProps) {
  const pathname = usePathname();
  const breadcrumbTitle =
    slug?.replace(/-/g, " ") ||
    pathname.split("/").filter(Boolean).at(-1)?.replace(/-/g, " ") ||
    "page";

  return (
    <main className="overflow-hidden">
      <PageHeader titleSize="2xl" title={breadcrumbTitle}>
        <p className="text-sm text-foreground/55">Page not found</p>
        <div className="mt-3">
          <Breadcrumb>
            <BreadcrumbItem href="/">home</BreadcrumbItem>
            <BreadcrumbItem>{breadcrumbTitle}</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </PageHeader>
      <SectionDivider />
      <section>
        <div className="mx-auto max-w-3xl px-6 py-10">
          <h2 className="font-mono text-lg font-bold text-foreground">
            404 Page not found
          </h2>
          <p className="text-sm leading-6 text-foreground/55">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex text-sm font-bold text-primary underline underline-offset-4 transition-colors hover:text-primary-hover"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
