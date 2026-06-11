"use client";

import Link from "next/link";
import { usePosts } from "@/src/features/public/posts/hooks";
import { Pagination } from "@/src/components/Pagination";
import { Breadcrumbs } from "@/src/components/BreadCrumbs";
import { PageLayout } from "@/src/layouts/PageLayout";
import { use } from "react";

export default function BlogListView({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = use(searchParams);
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 5;

  const { posts: paginatedPosts, meta, isLoading } = usePosts({
    postType: "POST",
    status: "PUBLISHED",
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  });

  const totalPages = Math.ceil((meta?.total || 0) / pageSize) || 1;

  return (
    <PageLayout
      title={
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Posts</h1>
          <Breadcrumbs items={[{ label: "posts" }]} />
        </div>
      }
    >
          <div className="flex flex-col gap-12">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm font-mono text-foreground/40 animate-pulse">Loading posts...</p>
              </div>
            )}

            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post, idx) => (
                <article key={`${post.slug}-${idx}`} className="group flex flex-col items-start">
                  <time className="text-sm font-medium text-foreground/40 mb-2 font-mono">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    }) : 'Draft'}
                  </time>
                  <h2 className="text-xl font-bold hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.slug.replace(/-/g, ' ')}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm font-medium text-foreground/60 leading-relaxed line-clamp-3">
                    { post.excerpt && post.excerpt.replace(/[#*`]/g, '').substring(0, 200) }...
                  </p>
                </article>
              ))
            ) : !isLoading && (
              <p className="text-foreground/40 italic">No posts found.</p>
            )}
          </div>

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            basePath="/blog"
          />
    </PageLayout>
  );
}