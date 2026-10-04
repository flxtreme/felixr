"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  useKBar,
  useMatches,
  useRegisterActions,
  type Action,
} from "kbar";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getPosts } from "@/src/features/public/posts/services";
import { getProjects } from "@/src/features/public/projects/services";
import { getExperience } from "@/src/features/public/experience/services";
import { getGigs } from "@/src/features/public/gigs/services";
import { getStacks } from "@/src/features/public/stack/services";
import { getCertifications } from "@/src/features/public/certifications/services";
import { getTrainings } from "@/src/features/public/trainings/services";
import { searchProducts } from "@/src/features/public/products/services";
import { experienceAnchor } from "@/src/features/public/experience/data";
import { cln } from "@/src/utils/cln";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

async function searchPublicContent(query: string) {
  const [posts, projects, experience, gigs, stacks, certifications, trainings, products] = await Promise.all([
    getPosts({ search: query, limit: 5, status: "PUBLISHED", postType: "POST" }),
    getProjects({ search: query, limit: 5 }),
    getExperience({ search: query, limit: 5 }),
    getGigs({ search: query, limit: 5 }),
    getStacks({ search: query, limit: 5 }),
    getCertifications({ search: query, limit: 5 }),
    getTrainings({ search: query, limit: 5 }),
    searchProducts(query),
  ]);

  return {
    posts: posts.data,
    projects: projects.data,
    experience: experience.data,
    gigs: gigs.data,
    stacks: stacks.data,
    certifications: certifications.data,
    trainings: trainings.data,
    products: products.data,
  };
}

function SearchTrigger() {
  const { query } = useKBar();

  return (
    <button
      type="button"
      onClick={() => {
        query.setSearch("");
        query.setCurrentRootAction(null);
        query.toggle();
      }}
      aria-label="Search"
      className="flex size-10 items-center justify-center rounded-full hover:bg-surface/25"
    >
      <Search size={18} />
    </button>
  );
}

function SearchPalette() {
  const router = useRouter();
  const { searchQuery, currentRootActionId, visualState, activeIndex } = useKBar((state) => ({
    searchQuery: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
    visualState: state.visualState,
    activeIndex: state.activeIndex,
  }));
  const { query } = useKBar();
  const { results } = useMatches();
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    if (visualState === "showing") query.getInput()?.focus();
  }, [query, visualState]);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedQuery(searchQuery.trim()),
      DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  const { data, isLoading, error } = useSWR(
    debouncedQuery.length >= MIN_QUERY_LENGTH ? ["global-search", debouncedQuery] : null,
    ([, query]: [string, string]) => searchPublicContent(query),
  );

  const actions = useMemo<Action[]>(() => {
    if (isLoading && debouncedQuery.length >= MIN_QUERY_LENGTH) {
      return [{
        id: "searching",
        name: "Searching...",
        keywords: searchQuery,
        perform: () => undefined,
      }];
    }
    if (error) {
      return [{
        id: "search-error",
        name: "Search failed. Try again.",
        keywords: searchQuery,
        perform: () => undefined,
      }];
    }
    if (!data) return [];

    const results: Action[] = [
      ...data.posts.map((post) => ({
        id: `post-${post.id}`,
        name: post.title,
        subtitle: "Blog post",
        keywords: post.excerpt ?? undefined,
        section: "Posts",
        perform: () => router.push(`/blog/${post.slug}`),
      })),
      ...data.projects.flatMap((project) => project.page?.slug ? [{
        id: `project-${project.id}`,
        name: project.title,
        subtitle: project.description ?? undefined,
        keywords: project.description ?? undefined,
        section: "Projects",
        perform: () => router.push(`/projects/${project.page!.slug}`),
      }] : []),
      ...data.experience.map((item) => ({
        id: `experience-${item.id}`,
        name: item.role,
        subtitle: item.company,
        keywords: item.responsibilities.join(" "),
        section: "Experience",
        perform: () => router.push(`/experience/#${encodeURIComponent(experienceAnchor(item.role))}`),
      })),
      ...data.gigs.map((gig) => ({
        id: `gig-${gig.id}`,
        name: gig.title,
        subtitle: gig.description,
        keywords: `${gig.description} ${gig.details.join(" ")}`,
        section: "Gigs",
        perform: () => router.push(`/gigs/#${encodeURIComponent(gig.id)}`),
      })),
      ...data.stacks.map((stack) => ({
        id: `stack-${stack.id}`,
        name: stack.label,
        subtitle: stack.category,
        keywords: `${stack.key} ${stack.category}`,
        section: "Stack",
        perform: () => router.push(`/stack/#${encodeURIComponent(stack.key)}`),
      })),
      ...data.certifications.map((certification) => ({
        id: `certification-${certification.id}`,
        name: certification.title,
        subtitle: certification.issuer,
        keywords: `${certification.issuer} ${certification.description}`,
        section: "Certifications",
        perform: () => router.push(`/certifications/#${encodeURIComponent(certification.id)}`),
      })),
      ...data.trainings.map((training) => ({
        id: `training-${training.id}`,
        name: training.title,
        subtitle: training.provider,
        keywords: training.description,
        section: "Trainings",
        perform: () => router.push(`/trainings/#${encodeURIComponent(training.id)}`),
      })),
      ...data.products.map((product) => ({
        id: `product-${product.id}`,
        name: product.title,
        subtitle: `${product.category} · ${product.price === 0 ? "Free" : `$${product.price}`}`,
        keywords: `${product.category} ${product.description}`,
        section: "Shop",
        perform: () => {
          if (product.actionType === "download") {
            const downloadLink = document.createElement("a");
            downloadLink.href = product.link;
            downloadLink.download = "";
            downloadLink.click();
          } else if (product.link.startsWith("/")) {
            router.push(product.link);
          } else {
            window.open(product.link, "_blank", "noopener,noreferrer");
          }
        },
      })),
    ];

    return results.length > 0
      ? results
      : [{
          id: "no-results",
          name: "No results found",
          keywords: searchQuery,
          perform: () => undefined,
        }];
  }, [data, debouncedQuery, error, isLoading, router, searchQuery]);

  useRegisterActions(actions, [actions]);

  return (
    <KBarPortal>
      <KBarPositioner className="fixed inset-0 z-50 bg-background/75 p-4 backdrop-blur-sm">
        <KBarAnimator className="mx-auto mt-[12vh] w-full max-w-xl overflow-hidden border border-foreground/15 bg-background shadow-2xl">
          <input
            ref={query.inputRefSetter}
            value={searchQuery}
            onChange={(event) => query.setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !searchQuery && currentRootActionId) {
                event.preventDefault();
                query.setCurrentRootAction(null);
              }
            }}
            autoComplete="off"
            autoFocus
            role="combobox"
            aria-expanded={visualState === "showing"}
            aria-controls="kbar-listbox"
            aria-activedescendant={`kbar-listbox-item-${activeIndex}`}
            placeholder="Search posts, projects, experience, gigs, stack, certifications, trainings, shop..."
            className="w-full border-b border-foreground/10 bg-transparent px-4 py-4 text-sm text-foreground outline-none placeholder:text-foreground/40"
          />
          <KBarResults
            items={results}
            onRender={({ item, active }) =>
              typeof item === "string" ? (
                <div className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                  {item}
                </div>
              ) : (
                <div
                  className={cln("flex cursor-pointer flex-col gap-1 px-4 py-3", active && "bg-foreground/5")}
                >
                  <span className="text-sm text-foreground/80">{item.name}</span>
                  {item.subtitle && <span className="text-xs text-foreground/45">{item.subtitle}</span>}
                </div>
              )
            }
          />
          {searchQuery.trim().length < MIN_QUERY_LENGTH && (
            <p className="border-t border-foreground/10 px-4 py-3 text-xs text-foreground/40">
              Type at least {MIN_QUERY_LENGTH} characters to search.
            </p>
          )}
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

export function GlobalSearch({ children }: { children: ReactNode }) {
  return (
    <KBarProvider>
      {children}
      <SearchPalette />
    </KBarProvider>
  );
}

export { SearchTrigger };
