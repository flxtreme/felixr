import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Post } from "@/src/features/public/posts/types";
import PostRender from "@/src/components/PostRenderer";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import * as service from "@/src/features/public/posts/services";
import parseMetadata from "@/src/utils/parseMetadata";

interface Props {
  params: Promise<{ slug: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getPage(slug: string): Promise<Post | null> {
  const reservedSlugs = ["projects", "blog"];

  if (reservedSlugs.includes(slug)) {
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/api/public/post/page/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [page, metadata, content] = await Promise.all([
    getPage(slug),
    service.getPostMetadataBySlug(slug),
    service.getPostContentBySlug(slug),
  ]);

  if (!page) {
    return {};
  }

  return parseMetadata(page, slug, content, metadata);
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;

  const [page, content] = await Promise.all([getPage(slug), service.getPostContentBySlug(slug)]);

  if (!page) {
    notFound();
  }

  return (
    <main className="overflow-hidden">
      <section className="hero-dot-grid">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-12 lg:pb-24 lg:pt-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-transform hover:-translate-x-1"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
          <p className="eyebrow mt-12">A little context</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.04em] text-foreground sm:text-7xl">
            {page.title || page.slug?.replace(/-/g, " ")}
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-5 text-xs text-foreground/45">
            {page.views !== undefined && (
              <span className="font-mono uppercase tracking-widest">{page.views} views</span>
            )}
            <Breadcrumb>
              <BreadcrumbItem>{(page.title || page.slug)?.toLowerCase()}</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </section>

      <section className="bg-surface/45">
        <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <PostRender content={content} />
          {page.tags && page.tags.length > 0 && (
            <div className="mt-16 flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                Topics
              </span>
              {page.tags.map((tag, index) => (
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
