"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { usePosts } from "@/src/features/public/posts/hooks";
import { useProjects } from "@/src/features/public/projects/hooks";
import { PostShimmer, ProjectShimmer } from "@/src/components/shimmer/PostShimmer";
import { SOCIAL_ICONS } from "@/src/common/icons";
import { stringToKey } from "@/src/utils/string";
import { cln } from "@/src/utils/cln";
import { Button } from "@/src/components/Button";
import { ProjectCard } from "@/src/features/public/components/ProjectCard";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/flxtreme" },
  { label: "LinkedIn", href: "https://linkedin.com/in/flxtremee" },
  { label: "X", href: "https://x.com/flxtremee" },
];

export default function HomeView() {
  const { posts: latestPosts, isLoading: postsLoading } = usePosts({
    postType: "POST",
    status: "PUBLISHED",
    limit: 3,
  });

  const { projects: featuredProjects, isLoading: projectsLoading } = useProjects({
    limit: 6,
  });

  return (
    <div className="flex flex-col">

      {/* Hero / About */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-14">

          {/* Avatar + name row */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden ring-2 ring-border">
              <Image
                src="/og-image.jpg"
                alt="Felix R"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-0.5">
                Available for work
              </p>
              <h1 className="text-3xl font-bold text-primary leading-none">felix <span className="text-foreground">ruz</span></h1>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl font-semibold text-foreground leading-snug max-w-lg mb-2">
            Full-Stack | Agentic
          </p>
          <p className="text-base text-foreground/55 leading-relaxed max-w-xl mb-8">
            I love coding, been at it for nearly 8 years now.
          </p>

          {/* CTA + socials */}
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all underline underline-offset-4"
            >
              More about me <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-4">
              {socialLinks.map(({ label, href }) => {
                const iconKey = stringToKey(label);
                const Icon = SOCIAL_ICONS[iconKey];
                return (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-foreground/40 hover:text-primary transition-colors group"
                  >
                    {Icon && <Icon className="w-4 h-4 group-hover:text-primary transition-colors" />}
                    <span className="group-hover:underline underline-offset-4">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Latest Posts</h2>
            <Link
              href="/blog"
            >
              <Button
                variant="tertiary"
                size="sm"
              >
                View all
              </Button>
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {postsLoading ? (
              <PostShimmer />
            ) : latestPosts.length > 0 ? (
              latestPosts.map((post, idx) => {
                const publishedAt = post?.publishedAt ?? post?.createdAt ?? post?.updatedAt;
                return (
                  <article
                    key={`${post.id}-${idx}`}
                    className="group py-6 first:pt-0 last:pb-0"
                  >
                    <Link href={`/blog/${post.slug}`} className="block space-y-1.5">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="group-hover:underline text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {post.title || post.slug.replace(/-/g, " ")}
                        </h3>
                        <ArrowRight className="w-4 h-4 shrink-0 text-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-sm text-foreground/55 leading-relaxed line-clamp-2">
                        {post.excerpt && post.excerpt.replace(/[#*`]/g, "").substring(0, 160)}
                      </p>
                      <time
                        className="block text-xs font-medium text-foreground/35 font-mono pt-0.5"
                        dateTime={post.publishedAt || undefined}
                      >
                        {publishedAt
                          ? new Date(publishedAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                          : "—"}
                      </time>
                    </Link>
                  </article>
                );
              })
            ) : (
              <p className="text-sm text-foreground/40 italic py-6">No posts published yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="border-b border-border">
        <div className={cln(
          "mx-auto py-12 space-y-8",
          featuredProjects.length >= 3 && "max-w-7xl",
          featuredProjects.length === 2 && "max-w-5xl",
          featuredProjects.length <= 1 && "max-w-3xl"
        )}>
          <div className="w-full max-w-3xl mx-auto flex items-center justify-between px-6">
            <h2 className="text-lg font-bold tracking-tight">Projects</h2>
            <Link
              href="/projects"
            >
              <Button
                variant="tertiary"
                size="sm"
              >
                View all
              </Button>
            </Link>
          </div>

          <div className={cln(
            "grid gap-4 px-6",
            featuredProjects.length === 1 && "grid-cols-1",
            featuredProjects.length === 2 && "grid-cols-1 sm:grid-cols-2",
            featuredProjects.length >= 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {projectsLoading ? (
              <ProjectShimmer count={6} />
            ) : featuredProjects.length > 0 ? (
              featuredProjects.map((project, idx) => {

                return <ProjectCard key={`project-item-${idx}`} project={project} />
              })
            ) : (
              <p className="text-sm text-foreground/40 italic py-6 col-span-3">
                No projects yet.
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}