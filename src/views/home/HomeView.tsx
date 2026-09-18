"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { usePosts } from "@/src/features/public/posts/hooks";
import { useProjects } from "@/src/features/public/projects/hooks";
import { PostShimmer, ProjectCardShimmer } from "@/src/components/shimmer/PostShimmer";
import { TechStackMarquee } from "@/src/features/public/components/TechStackMarquee";
import { SOCIAL_ICONS } from "@/src/common/icons";

const cleanExcerpt = (excerpt?: string | null) =>
  excerpt?.replace(/[#*`]/g, "").substring(0, 150) ||
  "A project built with care, curiosity, and a little bit of unreasonable ambition.";
const GithubIcon = SOCIAL_ICONS.github;
const LinkedinIcon = SOCIAL_ICONS.linkedin;

export default function HomeView() {
  const { posts: latestPosts, isLoading: postsLoading } = usePosts({
    postType: "POST",
    status: "PUBLISHED",
    limit: 3,
  });
  const { projects: featuredProjects, isLoading: projectsLoading } = useProjects({ limit: 6 });

  return (
    <main className="overflow-hidden">
      <section className="hero-dot-grid relative">
        <div className="mx-auto grid max-w-6xl items-end gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1fr_24rem] lg:gap-20 lg:pt-28">
          <div className="reveal-up">
            <p className="mb-6 flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="size-2 animate-pulse rounded-full bg-primary" /> Available for work
            </p>
            <h1 className="max-w-4xl text-6xl font-black leading-[0.92] tracking-[-0.04em] text-foreground sm:text-8xl">
              Felix <span className="text-primary">Ruz</span>
            </h1>
            <p className="mt-8 text-2xl font-semibold tracking-tight text-foreground/80 sm:text-3xl">
              Full-Stack <span className="text-primary">|</span> Agentic
            </p>
            <p className="mt-4 max-w-md text-base leading-7 text-foreground/55">
              I love coding, been at it for nearly 8 years now. I build useful things for the web,
              and increasingly, with the web&apos;s new AI-shaped tools.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Know me better <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/gigs"
                className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Gigs <ArrowUpRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4 text-foreground/45">
              <span className="font-mono text-xs uppercase tracking-widest">Find me</span>
              <Link
                aria-label="GitHub"
                href="https://github.com/flxtreme"
                target="_blank"
                className="transition-colors hover:text-primary"
              >
                <GithubIcon className="size-5" />
              </Link>
              <Link
                aria-label="LinkedIn"
                href="https://linkedin.com/in/flxrzjr"
                target="_blank"
                className="transition-colors hover:text-primary"
              >
                <LinkedinIcon className="size-5" />
              </Link>
            </div>
          </div>
          <div
            className="reveal-up hero-portrait-shell lg:mb-4"
            style={{ animationDelay: "140ms" }}
          >
            <div className="hero-portrait-frame">
              <div className="hero-portrait-image">
                <Image
                  src="/og-image.jpg"
                  alt="Felix Ruz"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="carousel-dot-grid pb-6">
        <div className="w-full py-4">
          <TechStackMarquee />
        </div>
      </section>

      <section className="bg-surface/45">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="section-title">
                A few things
                <br />
                <span className="text-primary">I&apos;ve shipped.</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden items-center gap-2 text-sm font-bold text-primary hover:gap-3 sm:flex"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          {projectsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProjectCardShimmer key={index} />
              ))}
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, index) => {
                const page = project.page;
                return (
                  <Link
                    href={`/projects/${page?.slug}`}
                    key={project.id}
                    className="group flex min-h-56 flex-col justify-between border border-border bg-background p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10 reveal-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div>
                      <div className="mb-8 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-foreground/35">
                          0{index + 1} / 06
                        </span>
                        <ArrowUpRight className="size-4 text-foreground/25 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                      <h3 className="text-lg font-bold transition-colors group-hover:text-primary">
                        {page?.title || project.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-foreground/50">
                        {cleanExcerpt(page?.excerpt || project.description)}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between font-mono text-[10px] text-foreground/35">
                      <span>
                        {page?.publishedAt ? new Date(page.publishedAt).getFullYear() : "Recent"}
                      </span>
                      <span>{page?.views ?? 0} views</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-foreground/45">
              Projects are taking shape. Check back soon.
            </p>
          )}
          <Link
            href="/projects"
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary sm:hidden"
          >
            View all projects <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="section-title">
              Latest
              <br />
              <span className="text-primary">thoughts.</span>
            </h2>
            <Link
              href="/blog"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3"
            >
              Read the blog <ArrowRight className="size-4" />
            </Link>
          </div>
          <div>
            {postsLoading ? (
              <PostShimmer />
            ) : latestPosts.length > 0 ? (
              <div className="divide-y divide-border border-t border-border">
                {latestPosts.map((post, index) => {
                  const publishedAt = post.publishedAt ?? post.createdAt;
                  return (
                    <Link
                      href={`/blog/${post.slug}`}
                      key={`${post.id ?? post.slug}-${index}`}
                      className="group block py-5 first:pt-4"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-foreground/35">
                            {new Date(publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <h3 className="text-lg font-bold transition-colors group-hover:text-primary">
                            {post.title}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-foreground/50">
                            {cleanExcerpt(post.excerpt)}
                          </p>
                        </div>
                        <ArrowUpRight className="mt-1 size-4 shrink-0 text-foreground/25 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-foreground/45">New writing is on its way.</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-surface/45">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[0.7fr_1.3fr] md:items-end">
          <div>
            <h2 className="section-title">
              More than
              <br />
              <span className="text-primary">just code.</span>
            </h2>
          </div>
          <div className="max-w-xl">
            <p className="text-xl font-semibold leading-8 text-foreground/80">
              I enjoy the whole shape of a product: finding the useful idea, giving it a clear
              interface, and making the underlying system dependable.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3"
            >
              Know me better <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/65">
              Have a good problem?
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
              Let&apos;s make something useful.
            </h2>
            <p className="mt-3 text-sm text-white/75">
              Available for freelance work and part-time roles.
            </p>
          </div>
          <Link
            href="/gigs"
            className="inline-flex shrink-0 items-center gap-2 self-start bg-white px-5 py-3 text-sm font-bold text-primary transition-transform hover:-translate-y-0.5 sm:self-center"
          >
            See my availability <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
