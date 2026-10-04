"use client";

import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/src/components/PageHeader";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { SectionDivider } from "@/src/components/SectionDivider";
import { useGigs } from "@/src/features/public/gigs/hooks/useGigs";

export default function GigsView() {
  const { gigs, isLoading, error } = useGigs({ limit: 100 });

  return (
    <main className="overflow-hidden">
      <PageHeader
        eyebrow="gigs"
        title="Bring me a good problem."
      >
        <div className="mt-6">
          <Breadcrumb>
            <BreadcrumbItem href="/">home</BreadcrumbItem>
            <BreadcrumbItem>gigs</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </PageHeader>
      <SectionDivider />
      <section id="gigs">
        <div className="mx-auto max-w-3xl px-6 py-10">
          {isLoading ? (
            <div className="space-y-6" aria-label="Loading gigs">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-40 animate-pulse border-t border-foreground/10 bg-foreground/[0.03]" />
              ))}
            </div>
          ) : error ? (
            <p className="py-12 text-center text-sm text-foreground/55">
              Gigs couldn&apos;t be loaded. Please try again later.
            </p>
          ) : gigs.length === 0 ? (
            <p className="py-12 text-center text-sm text-foreground/55">
              No gigs are available right now. Please check back soon.
            </p>
          ) : (
            <div className="divide-y divide-foreground/10">
              {gigs.map((gig) => (
                <article id={gig.id} key={gig.id} className="py-8 first:pt-0">
                  <h2 className="text-xl font-bold text-foreground">{gig.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/55">
                    {gig.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/65">
                    {gig.details.map((detail, index) => (
                      <li key={`${detail}-${index}`} className="flex items-center gap-2">
                        <Check className="size-4 shrink-0 text-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  {gig.external ? (
                    <a
                      href={gig.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-[gap] hover:gap-3"
                    >
                      {gig.linkLabel} <ArrowUpRight className="size-4" />
                    </a>
                  ) : (
                    <Link
                      href={gig.link}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-[gap] hover:gap-3"
                    >
                      {gig.linkLabel} <ArrowUpRight className="size-4" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
