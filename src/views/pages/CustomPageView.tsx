import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Post } from "@/src/features/public/posts/types";
import PostRender from "@/src/components/PostRenderer";
import { Breadcrumbs } from "@/src/components/BreadCrumbs";
import { PageLayout } from "@/src/layouts/PageLayout";
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
    <PageLayout
      title={
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            {page.title || page.slug.replace(/-/g, " ")}
          </h1>

          <Breadcrumbs
            items={[
              {
                label: (page.title || page.slug).toLowerCase(),
              },
            ]}
          />
        </div>
      }
    >
      <PostRender content={content} />
    </PageLayout>
  );
}
