"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPosts } from "@/src/features/admin/posts/services";
import { getProjects } from "@/src/features/admin/project/services";
import { getTags } from "@/src/features/admin/tags/services";
import { getAdminResources } from "@/src/features/admin/resources/services";
import { getAdminProducts } from "@/src/features/admin/products/services";
import type { AdminResourceRecord } from "@/src/features/admin/resources/types";
import type { Post } from "@/src/features/admin/posts/types";
import type { Project } from "@/src/features/admin/project/types";
import type { Tag } from "@/src/features/admin/tags/types";
import type { AdminProduct } from "@/src/features/admin/products/types";
import { cln } from "@/src/utils/cln";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;
const PAGE_SIZE = 5;

type AdminSearchData = {
  posts: Post[];
  pages: Post[];
  projects: Project[];
  tags: Tag[];
  users: AdminResourceRecord[];
  gigs: AdminResourceRecord[];
  experience: AdminResourceRecord[];
  trainings: AdminResourceRecord[];
  certifications: AdminResourceRecord[];
  stacks: AdminResourceRecord[];
  products: AdminProduct[];
};

function listFromResult<T>(result: PromiseSettledResult<{ data: T[] }>) {
  return result.status === "fulfilled" ? result.value.data : [];
}

async function searchAdminContent(query: string): Promise<AdminSearchData> {
  const resourceQuery = { search: query, offset: 0, limit: PAGE_SIZE };
  const results = await Promise.allSettled([
    getPosts({ search: query, limit: PAGE_SIZE, postType: "POST" }),
    getPosts({ search: query, limit: PAGE_SIZE, postType: "PAGE" }),
    getProjects({ search: query, limit: PAGE_SIZE, offset: 0 }),
    getTags({ search: query, limit: PAGE_SIZE, offset: 0 }),
    getAdminResources("user", resourceQuery),
    getAdminResources("gig", resourceQuery),
    getAdminResources("experience", resourceQuery),
    getAdminResources("training", resourceQuery),
    getAdminResources("certification", resourceQuery),
    getAdminResources("stack", resourceQuery),
    getAdminProducts({ search: query, offset: 0, limit: PAGE_SIZE }),
  ]);

  if (results.every((result) => result.status === "rejected")) {
    throw new Error("Admin search is unavailable.");
  }

  return {
    posts: listFromResult(results[0]),
    pages: listFromResult(results[1]),
    projects: listFromResult(results[2]),
    tags: listFromResult(results[3]),
    users: listFromResult(results[4]),
    gigs: listFromResult(results[5]),
    experience: listFromResult(results[6]),
    trainings: listFromResult(results[7]),
    certifications: listFromResult(results[8]),
    stacks: listFromResult(results[9]),
    products: listFromResult(results[10]),
  };
}

function AdminSearchTrigger() {
  const { query } = useKBar();

  return (
    <button
      type="button"
      onClick={() => {
        query.setSearch("");
        query.setCurrentRootAction(null);
        query.toggle();
      }}
      aria-label="Search admin"
      title="Search admin"
      className="flex size-10 items-center justify-center rounded-full text-foreground/65 transition-colors hover:bg-foreground/5 hover:text-primary"
    >
      <Search aria-hidden="true" size={18} />
    </button>
  );
}

function AdminSearchPalette() {
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
    const timeout = window.setTimeout(() => setDebouncedQuery(searchQuery.trim()), DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  const { data, isLoading, error } = useSWR<AdminSearchData>(
    debouncedQuery.length >= MIN_QUERY_LENGTH ? ["admin-kbar-search", debouncedQuery] : null,
    ([, term]: [string, string]) => searchAdminContent(term),
  );

  const searchActions = useMemo<Action[]>(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) return [];
    if (isLoading) return [{ id: "admin-searching", name: "Searching admin...", section: "Results", perform: () => undefined }];
    if (error) return [{ id: "admin-search-error", name: "Admin search failed. Try again.", section: "Results", perform: () => undefined }];
    if (!data) return [];

    const toListSearch = (route: string) => `${route}?search=${encodeURIComponent(debouncedQuery)}&status=all`;
    const actions: Action[] = [
      ...data.posts.map((post) => ({ id: `admin-post-${post.id}`, name: post.title, subtitle: post.slug, keywords: `${post.slug} ${post.excerpt ?? ""}`, section: "Posts", perform: () => router.push(`/admin/posts/${post.id}`) })),
      ...data.pages.map((page) => ({ id: `admin-page-${page.id}`, name: page.title, subtitle: page.slug, keywords: `${page.slug} ${page.excerpt ?? ""}`, section: "Pages", perform: () => router.push(`/admin/pages/${page.id}`) })),
      ...data.projects.map((project) => ({ id: `admin-project-${project.id}`, name: project.title, subtitle: project.page?.title ?? project.description ?? undefined, keywords: `${project.description ?? ""} ${project.page?.title ?? ""}`, section: "Projects", perform: () => router.push(`/admin/projects/${project.id}`) })),
      ...data.tags.map((tag) => ({ id: `admin-tag-${tag.id}`, name: tag.name, subtitle: tag.slug, keywords: tag.slug, section: "Tags", perform: () => router.push(toListSearch("/admin/tags")) })),
      ...data.users.map((user) => ({ id: `admin-user-${user.id}`, name: String(user.name || user.username || user.email), subtitle: String(user.email ?? ""), keywords: `${String(user.username ?? "")} ${String(user.email ?? "")}`, section: "Users", perform: () => router.push(toListSearch("/admin/users")) })),
      ...data.gigs.map((gig) => ({ id: `admin-gig-${gig.id}`, name: String(gig.title), subtitle: String(gig.description ?? ""), keywords: String(gig.description ?? ""), section: "Gigs", perform: () => router.push(toListSearch("/admin/gigs")) })),
      ...data.experience.map((item) => ({ id: `admin-experience-${item.id}`, name: String(item.role), subtitle: String(item.company ?? ""), keywords: Array.isArray(item.responsibilities) ? item.responsibilities.join(" ") : "", section: "Experience", perform: () => router.push(toListSearch("/admin/experience")) })),
      ...data.trainings.map((training) => ({ id: `admin-training-${training.id}`, name: String(training.title), subtitle: String(training.provider ?? ""), keywords: String(training.description ?? ""), section: "Trainings", perform: () => router.push(toListSearch("/admin/trainings")) })),
      ...data.certifications.map((certification) => ({ id: `admin-certification-${certification.id}`, name: String(certification.title), subtitle: String(certification.issuer ?? ""), keywords: String(certification.description ?? ""), section: "Certifications", perform: () => router.push(toListSearch("/admin/certifications")) })),
      ...data.stacks.map((stack) => ({ id: `admin-stack-${stack.id}`, name: String(stack.label), subtitle: String(stack.category ?? ""), keywords: `${String(stack.key ?? "")} ${String(stack.category ?? "")}`, section: "Stacks", perform: () => router.push(toListSearch("/admin/stacks")) })),
      ...data.products.map((product) => ({ id: `admin-product-${product.id}`, name: product.title, subtitle: `${product.category} · ${product.price === 0 ? "FREE" : `$${product.price}`}`, keywords: `${product.description} ${product.category}`, section: "Shop products", perform: () => router.push(toListSearch("/admin/shop")) })),
    ];

    return actions.length ? actions : [{ id: "admin-no-results", name: "No admin results found", section: "Results", perform: () => undefined }];
  }, [data, debouncedQuery, error, isLoading, router]);

  useRegisterActions(searchActions, [searchActions]);

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
            aria-controls="admin-kbar-listbox"
            aria-activedescendant={`admin-kbar-listbox-item-${activeIndex}`}
            placeholder="Search admin pages and records..."
            className="w-full border-b border-foreground/10 bg-transparent px-4 py-4 text-sm text-foreground outline-none placeholder:text-foreground/40"
          />
          <KBarResults
            items={results}
            onRender={({ item, active }) => typeof item === "string" ? (
              <div className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground/40">{item}</div>
            ) : (
              <div className={cln("flex cursor-pointer flex-col gap-1 px-4 py-3", active && "bg-foreground/5")}>
                <span className="text-sm text-foreground/80">{item.name}</span>
                {item.subtitle && <span className="text-xs text-foreground/45">{item.subtitle}</span>}
              </div>
            )}
          />
          {searchQuery.trim().length < MIN_QUERY_LENGTH && (
            <p className="border-t border-foreground/10 px-4 py-3 text-xs text-foreground/40">Type at least {MIN_QUERY_LENGTH} characters to search admin records, or select a destination.</p>
          )}
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

export function AdminSearchProvider({ children }: { children: ReactNode }) {
  return (
    <KBarProvider>
      {children}
      <AdminSearchPalette />
    </KBarProvider>
  );
}

export { AdminSearchTrigger };
