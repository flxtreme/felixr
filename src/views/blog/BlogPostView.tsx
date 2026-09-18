import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Post } from "@/src/features/admin/posts/types";
import PostRender from "@/src/components/PostRenderer";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import * as service from "@/src/features/public/posts/services";
import parseMetadata from "@/src/utils/parseMetadata";
import { PageViews } from "@/src/lib/analytics/useViews";

interface Props {
  params: Promise<{ slug: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/api/public/post/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const post: Post = await res.json();

    if (post.postType !== "POST") {
      return null;
    }

    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [post, metadata, content] = await Promise.all([
    getPost(slug),
    service.getPostMetadataBySlug(slug),
    service.getPostContentBySlug(slug),
  ]);

  if (!post) {
    return {};
  }

  return parseMetadata(post, slug, content, metadata);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const [post, content] = await Promise.all([getPost(slug), service.getPostContentBySlug(slug)]);

  if (!post) {
    notFound();
  }

  return (
    <main className="overflow-hidden">
      <section className="hero-dot-grid">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:py-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-transform hover:-translate-x-1"
          >
            <ArrowLeft className="size-4" /> Back to posts
          </Link>
          <div className="mt-5 flex items-center gap-3 text-xs text-foreground/45">
            <span className="font-mono uppercase tracking-widest">
              {post.publishedAt ?? post.createdAt ?? "-"}
            </span>
            <span aria-hidden="true">*</span>
            <PageViews path={["blog", post.slug]} className="text-foreground/45" />
          </div>
          <div className="mt-3">
            <Breadcrumb>
              <BreadcrumbItem href="/blog">posts</BreadcrumbItem>
              <BreadcrumbItem>{(post.title || post.slug).toLowerCase()}</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </section>

      <section className="bg-surface/45">
        <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
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
