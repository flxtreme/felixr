"use client";

import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { CertificationCard } from "@/src/components/CertificationCard";
import { PageHeader } from "@/src/components/PageHeader";
import { SectionDivider } from "@/src/components/SectionDivider";
import useCertifications from "@/src/features/public/certifications/hooks/useCertifications";
import { cln } from "@/src/utils/cln";

export default function CertificationsView() {
  const { certifications, error, isLoading } = useCertifications({ limit: 100, offset: 0 });

  return (
    <main className="overflow-hidden">
      <PageHeader eyebrow="certifications" title="Credentials and continued learning.">
        <Breadcrumb>
          <BreadcrumbItem href="/">home</BreadcrumbItem>
          <BreadcrumbItem>certifications</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>
      <SectionDivider />
      <section id="certifications" className={cln("border-b border-dashed border-foreground/10")}>
        <div className={cln("mx-auto max-w-6xl px-6 py-12")}>
          {isLoading ? (
            <p className={cln("py-12 text-center text-sm text-foreground/55")} role="status">
              Loading certifications...
            </p>
          ) : error ? (
            <p className={cln("py-12 text-center text-sm text-foreground/55")} role="alert">
              Certifications couldn&apos;t be loaded. Please try again later.
            </p>
          ) : certifications.length === 0 ? (
            <p className={cln("py-12 text-center text-sm text-foreground/55")}>
              No certifications available yet.
            </p>
          ) : (
            <ul className={cln("columns-1 gap-6 sm:columns-2 lg:columns-4")}>
              {certifications.map((certification) => (
                <CertificationCard key={certification.id} certification={certification} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
