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

async function getProject(slug: string): Promise<Post | null> {
  const reservedSlugs = ["blog", "projects", "home"];
  if (reservedSlugs.includes(slug)) return null;

  try {
    const res = await fetch(`${API_URL}/public/post/page/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const post: Post = await res.json();

    const tags = (post.metadata?.tags as string[]) || [];

    console.log(tags);

    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return {};

  const description =
    ((project.metadata as unknown as Record<string, string>)?.description) ??
    project.content.replace(/[#*`]/g, '').substring(0, 160);

  return {
    title: project.title ?? slug,
    description,
    openGraph: {
      title: project.title,
      description,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <SinglePageLayout
      header={
        <div className="space-y-4">
          <span className="text-sm text-foreground/40 font-mono block">
            {project.publishedAt ? new Date(project.publishedAt).getFullYear() : 'Ongoing'}
          </span>
          <h1 className="text-4xl font-bold text-primary">
            {project.title || project.slug.replace(/-/g, ' ')}
          </h1>
          <Breadcrumbs items={[
            { label: "projects", href: "/projects" },
            { label: (project.title || project.slug).toLowerCase() }
          ]} />
        </div>
      }
    >
      <PostRender content={project.content} />
    </SinglePageLayout>
  );
}