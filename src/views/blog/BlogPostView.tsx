import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Post } from "@/src/features/admin/posts/types";
import PostRender from "@/src/components/PostRenderer";
import { Breadcrumbs } from "@/src/components/BreadCrumbs";
import { SinglePageLayout } from "@/src/layouts/SinglePageLayout";

interface Props {
  params: Promise<{ slug: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/public/post/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const post: Post = await res.json();
    if (post.postType !== "POST") return null;
    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return {};

  const description =
    ((post.metadata as unknown as Record<string, string>)?.description) ??
    post.content.substring(0, 160);

  return {
    title: post.title ?? slug,
    description,
    openGraph: {
      title: post.title,
      description
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <SinglePageLayout
      header={
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">
            {post.title || post.slug.replace(/-/g, " ")}
          </h1>
          <Breadcrumbs items={[
            { label: "posts", href: "/blog" },
            { label: (post.title || post.slug).toLowerCase() }
          ]} />
        </div>
      }
    >
      <PostRender content={post.content} />
    </SinglePageLayout>
  );
}