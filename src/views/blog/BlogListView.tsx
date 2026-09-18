"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePosts } from "@/src/features/public/posts/hooks";
import { Pagination } from "flxtheme";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { use } from "react";
import { PostShimmer } from "@/src/components/shimmer/PostShimmer";

export default function BlogListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const router = useRouter();
  const { page } = use(searchParams);
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 5;

  const {
    posts: paginatedPosts,
    meta,
    isLoading,
  } = usePosts({
    postType: "POST",
    status: "PUBLISHED",
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  });

  return (
    <main className="overflow-hidden">
      <section className="hero-dot-grid">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-14 lg:pb-16 lg:pt-20">
          <p className="eyebrow">Writing</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[0.94] tracking-[-0.04em] text-foreground sm:text-6xl">
            Notes from the
            <br />
            <span className="text-primary">workbench.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-foreground/55">
            Thoughts on building products, systems, and a better way to work with technology.
          </p>
          <div className="mt-6">
            <Breadcrumb>
              <BreadcrumbItem>posts</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </section>

      <section className="bg-surface/45">
        <div className="mx-auto max-w-6xl px-6 py-16">
          {isLoading && <PostShimmer count={pageSize} />}
          {paginatedPosts.length > 0 ? (
            <div className="divide-y divide-border border-t border-border">
              {paginatedPosts.map((post, index) => (
                <article key={`${post.slug}-${index}`} className="group px-5 py-8 first:pt-6">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                    <time>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                        : "Draft"}
                    </time>
                    {post.views !== undefined && <span>/ {post.views} views</span>}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold leading-tight transition-colors group-hover:text-primary">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title || post.slug.replace(/-/g, " ")}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/55">
                    {post.excerpt?.replace(/[#*`]/g, "").substring(0, 200) ||
                      "A note from the workbench."}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            !isLoading && <p className="text-sm text-foreground/45">No posts found.</p>
          )}

          <div className="mt-10 border-t border-border pt-8">
            <Pagination
              current={currentPage}
              total={meta?.total || 0}
              pageSize={pageSize}
              onPageChange={(page) => router.push(`/blog?page=${page}`)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
