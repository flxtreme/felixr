"use client";

import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { PageHeader } from "@/src/components/PageHeader";
import { SectionDivider } from "@/src/components/SectionDivider";
import { ExperienceCard } from "@/src/features/public/components/ExperienceCard";
import { experienceAnchor } from "@/src/features/public/experience/data";
import { useExperience } from "@/src/features/public/experience/hooks/useExperience";
import { useLayout } from "@/src/layouts/LayoutContext";
import { PageDirectory } from "@/src/layouts/parts/PageDirectory";
import { useEffect } from "react";

export default function ExperienceView() {
  const { experience, isLoading } = useExperience({ limit: 100 });
  const { setRightPanel } = useLayout();

  useEffect(() => {
    setRightPanel(
      <PageDirectory
        items={[{
          label: "experience",
          href: "/experience",
          kind: "folder",
          children: experience.map((item) => ({
            label: item.role,
            href: `/experience#${encodeURIComponent(experienceAnchor(item.role))}`,
            kind: "file" as const,
          })),
        }]}
      />,
    );
    return () => setRightPanel(null);
  }, [experience, setRightPanel]);

  return (
    <main className="overflow-hidden">
      <PageHeader eyebrow="experience" title="Career history.">
        <Breadcrumb>
          <BreadcrumbItem href="/">home</BreadcrumbItem>
          <BreadcrumbItem>experience</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>
      <SectionDivider />
      <section id="experience" className="border-b border-dashed border-foreground/10">
        <div className="mx-auto max-w-3xl px-6 py-12">
          {isLoading ? (
            <div className="space-y-6" aria-label="Loading experience">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-32 animate-pulse border-t border-foreground/10 bg-foreground/[0.03]" />
              ))}
            </div>
          ) : experience.map((item) => (
            <ExperienceCard
              id={experienceAnchor(item.role)}
              key={item.id}
              role={item.role}
              company={item.company}
              start={item.start}
              end={item.end}
              responsibilities={item.responsibilities}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
