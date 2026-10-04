"use client";

import { useRouter } from "next/navigation";
import { usePosts } from "@/src/features/public/posts/hooks";
import { Pagination } from "flxtheme";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { use } from "react";
import { PostShimmer } from "@/src/components/shimmer/PostShimmer";
import { PageHeader } from "@/src/components/PageHeader";
import { PostCard } from "@/src/components/PostCard";
import { SectionDivider } from "@/src/components/SectionDivider";
import { formatShortDate } from "@/src/utils/date";

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
      <PageHeader
        eyebrow="blog"
        title="Notes from the workbench."
      >
        <Breadcrumb>
          <BreadcrumbItem href="/">home</BreadcrumbItem>
          <BreadcrumbItem>blog</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>
      <SectionDivider />
      <section id="blogs">
        <div className="mx-auto max-w-3xl px-6 py-10">
          {isLoading && <PostShimmer count={pageSize} />}
          {paginatedPosts.length > 0 ? (
            <div className="divide-y divide-foreground/10">
              {paginatedPosts.map((post, index) => (
                <PostCard
                  key={`${post.slug}-${index}`}
                  href={`/blog/${post.slug}`}
                  title={post.title || post.slug.replace(/-/g, " ")}
                  excerpt={post.excerpt?.replace(/[#*`]/g, "").substring(0, 200) || "A note from the workbench."}
                  dateLabel={formatShortDate(post.publishedAt) || "Draft"}
                  views={post.views}
                  variant="compact"
                  excerptSize="sm"
                />
              ))}
            </div>
          ) : (
            !isLoading && <p className="text-sm text-foreground/45">No posts found.</p>
          )}

          <div className="mt-10 border-t border-foreground/10 pt-8">
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
