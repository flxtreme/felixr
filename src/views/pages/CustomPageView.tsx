import { Metadata } from "next";
import Link from "next/link";
import PostRender from "@/src/components/PostRenderer";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import * as service from "@/src/features/public/posts/serverServices";
import parseMetadata from "@/src/utils/parseMetadata";
import { RESERVED_SLUGS } from "@/src/common/reservedSlugs";
import { PageHeader } from "@/src/components/PageHeader";
import { SectionDivider } from "@/src/components/SectionDivider";
import { PageNotFound } from "@/src/components/PageNotFound";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPage(slug: string) {
  if (RESERVED_SLUGS.includes(slug)) {
    return null;
  }
  const page = await service.getPublicPageBySlug(slug);
  return page?.postType === "PAGE" ? page : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [page, metadata, content] = await Promise.all([
    getPage(slug),
    service.getPublicPostMetadataBySlug(slug),
    service.getPublicPostContentBySlug(slug),
  ]);

  if (!page) {
    return {};
  }

  return parseMetadata(page, slug, content, metadata);
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;

  const [page, content] = await Promise.all([getPage(slug), service.getPublicPostContentBySlug(slug)]);

  if (!page) {
    return <PageNotFound slug={slug} />;
  }

  return (
    <main className="overflow-hidden">
      <PageHeader
        titleSize="2xl"
        title={page.title || page.slug?.replace(/-/g, " ")}
      >
        <div className="flex flex-col gap-3">
          {page.views !== undefined && (
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/45">
              {page.views} views
            </span>
          )}
          <Breadcrumb>
            <BreadcrumbItem href="/">home</BreadcrumbItem>
            <BreadcrumbItem>{(page.title || page.slug)?.toLowerCase()}</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </PageHeader>
      <SectionDivider />
      <section>
        <article className="mx-auto max-w-3xl px-6 py-12">
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
