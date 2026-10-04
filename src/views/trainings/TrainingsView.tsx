"use client";

import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { PageHeader } from "@/src/components/PageHeader";
import { SectionDivider } from "@/src/components/SectionDivider";
import { TrainingCard } from "@/src/components/TrainingCard";
import useTrainings from "@/src/features/public/trainings/hooks/useTrainings";
import { cln } from "@/src/utils/cln";

export default function TrainingsView() {
  const { trainings, error, isLoading } = useTrainings({ limit: 100, offset: 0 });

  return (
    <main className={cln("overflow-hidden")}>
      <PageHeader eyebrow="trainings" title="Learning in motion.">
        <Breadcrumb>
          <BreadcrumbItem href="/">home</BreadcrumbItem>
          <BreadcrumbItem>trainings</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>
      <SectionDivider />
      <section id="trainings" className={cln("border-b border-dashed border-foreground/10")}>
        <div className={cln("mx-auto max-w-6xl px-6 py-12")}>
          {isLoading ? (
            <p className={cln("py-12 text-center text-sm text-foreground/55")} role="status">
              Loading trainings...
            </p>
          ) : error ? (
            <p className={cln("py-12 text-center text-sm text-foreground/55")} role="alert">
              Trainings couldn&apos;t be loaded. Please try again later.
            </p>
          ) : trainings.length === 0 ? (
            <p className={cln("py-12 text-center text-sm text-foreground/55")}>
              No trainings available yet.
            </p>
          ) : (
            <ul className={cln("columns-1 gap-6 sm:columns-2 lg:columns-4")}>
              {trainings.map((training) => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
