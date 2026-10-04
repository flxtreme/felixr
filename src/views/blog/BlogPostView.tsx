import { Metadata } from "next";
import Link from "next/link";
import PostRender from "@/src/components/PostRenderer";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import * as service from "@/src/features/public/posts/serverServices";
import parseMetadata from "@/src/utils/parseMetadata";
import { PageViews } from "@/src/lib/analytics/useViews";
import { RESERVED_SLUGS } from "@/src/common/reservedSlugs";
import { PageHeader } from "@/src/components/PageHeader";
import { SectionDivider } from "@/src/components/SectionDivider";
import { PageNotFound } from "@/src/components/PageNotFound";
import { formatDate } from "@/src/utils/date";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  if (RESERVED_SLUGS.includes(slug)) {
    return null;
  }
  const post = await service.getPublicPostBySlug(slug);
  return post?.postType === "POST" ? post : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [post, metadata, content] = await Promise.all([
    getPost(slug),
    service.getPublicPostMetadataBySlug(slug),
    service.getPublicPostContentBySlug(slug),
  ]);

  if (!post) {
    return {};
  }

  return parseMetadata(post, slug, content, metadata);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const [post, content] = await Promise.all([getPost(slug), service.getPublicPostContentBySlug(slug)]);

  if (!post) {
    return <PageNotFound slug={slug} />;
  }

  return (
    <main className="overflow-hidden">
      <PageHeader
        titleSize="2xl"
        eyebrow="blog"
        title={
          <div className="flex items-center gap-3 text-xs text-foreground/45">
            <span className="font-mono uppercase tracking-widest">
              {formatDate(post.publishedAt ?? post.createdAt) || "-"}
            </span>
            <span aria-hidden="true">*</span>
            <PageViews path={["blog", post.slug]} className="text-foreground/45" />
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          <Breadcrumb>
            <BreadcrumbItem href="/">home</BreadcrumbItem>
            <BreadcrumbItem href="/blog">blog</BreadcrumbItem>
            <BreadcrumbItem>{(post.title || post.slug).toLowerCase()}</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </PageHeader>
      <SectionDivider />
      <section>
        <article id="content" className="mx-auto max-w-3xl px-6 py-12">
          <PostRender content={content} />
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                Topics
              </span>
              {post.tags.map((tag, index) => (
                <Link
                  key={`${tag}-${index}`}
                  href={`/tags/${tag}`}
                  className="border border-border px-3 py-1.5 text-xs text-foreground/60 transition-colors hover:border-primary hover:text-primary"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
