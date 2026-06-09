import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Post } from "@/src/features/admin/posts/types";
import PostRender from "@/src/components/PostRenderer";
import { Breadcrumbs } from "@/src/components/BreadCrumbs";
import { PageLayout } from "@/src/layouts/PageLayout";

interface Props {
  params: Promise<{ slug: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getPage(slug: string): Promise<Post | null> {
  const reservedSlugs = ["projects", "blog"];
  if (reservedSlugs.includes(slug)) return null;

  try {
    const res = await fetch(`${API_URL}/public/post/page/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const post: Post = await res.json();
    if (post.postType !== "PAGE") return null;
    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) return {};

  const description =
    ((page.metadata as unknown as Record<string, string>)?.description) ??
    page.content.substring(0, 160);

  return {
    title: page.title ?? slug,
    description,
    openGraph: {
      title: page.title,
      description,
    },
  };
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) notFound();

  return (
    <PageLayout
      title={
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            {page.title || page.slug.replace(/-/g, " ")}
          </h1>
          <Breadcrumbs items={[{ label: (page.title || page.slug).toLowerCase() }]} />
        </div>
      }
    >
      <PostRender content={page.content} />
    </PageLayout>
  );
}