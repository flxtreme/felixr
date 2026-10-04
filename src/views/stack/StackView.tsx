"use client";

import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { PageHeader } from "@/src/components/PageHeader";
import { SectionDivider } from "@/src/components/SectionDivider";
import { SOCIAL_ICONS } from "@/src/common/icons";
import useStacks from "@/src/features/public/stack/hooks/useStacks";
import { groupStacksByCategory, techStackCategoryAnchor } from "@/src/features/public/stack/data";
import { cln } from "@/src/utils/cln";

export default function StackView() {
  const { stacks, error, isLoading } = useStacks({ limit: 100, offset: 0 });
  const categories = groupStacksByCategory(stacks);

  return (
    <main className={cln("overflow-hidden")}>
      <PageHeader eyebrow="stack" title="Tools & practices.">
        <Breadcrumb>
          <BreadcrumbItem href="/">home</BreadcrumbItem>
          <BreadcrumbItem>stack</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>
      <SectionDivider />
      <section className={cln("border-b border-dashed border-foreground/10")}>
        <div id="stack" className={cln("mx-auto max-w-3xl px-6 py-12")}>
          {isLoading ? (
            <p className={cln("py-12 text-center text-sm text-foreground/50")} role="status">
              Loading tools and practices…
            </p>
          ) : error ? (
            <p className={cln("py-12 text-center text-sm text-foreground/50")} role="alert">
              Could not load tools and practices. Please try again later.
            </p>
          ) : categories.length === 0 ? (
            <p className={cln("py-12 text-center text-sm text-foreground/50")}>
              No tools and practices yet.
            </p>
          ) : (
            categories.map((category, categoryIndex) => (
              <section
                id={techStackCategoryAnchor(category.label)}
                key={category.label}
                className={cln("py-8 first:pt-0")}
              >
                <h2 className={cln("mb-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground/65")}>
                  {`${String(categoryIndex + 1).padStart(2, "0")} - ${category.label}`}
                </h2>
                <ul className={cln("grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4")}>
                  {category.items.map((stack) => {
                    const Icon = SOCIAL_ICONS[stack.key];

                    return (
                      <li
                        id={stack.key}
                        key={stack.id}
                        className={cln("flex min-h-14 min-w-0 items-center gap-3 py-3")}
                      >
                        {Icon && (
                          <Icon
                            aria-hidden="true"
                            className={cln("size-8 shrink-0")}
                            style={{ color: stack.color }}
                          />
                        )}
                        <span className={cln("min-w-0 text-sm leading-tight text-foreground/75")}>
                          {stack.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
