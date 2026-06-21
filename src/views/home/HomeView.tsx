"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { usePosts } from "@/src/features/public/posts/hooks";
import { useProjects } from "@/src/features/public/projects/hooks";
import { PostShimmer, ProjectCardShimmer } from "@/src/components/shimmer/PostShimmer";
import { SOCIAL_ICONS } from "@/src/common/icons";
import { stringToKey } from "@/src/utils/string";
import { cln } from "@/src/utils/cln";
import { Button } from "@/src/components/Button";
import { ProjectCard } from "@/src/features/public/components/ProjectCard";
import { TechStackMarquee } from "@/src/features/public/components/TechStackMarquee";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/flxtreme" },
  { label: "LinkedIn", href: "https://linkedin.com/in/flxrzjr" },
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
      <section className="hero">
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-14">

          {/* Avatar + name row */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative w-24 h-24 shrink-0 rounded-full overflow-hidden ring-4 ring-primary/40">
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
          <p className="text-base text-foreground/55 leading-relaxed max-w-xl mb-6">
            I love coding, been at it for nearly 8 years now.
          </p>

          {/* CTA + socials */}
          <div className="flex flex-wrap items-center gap-6">
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
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all underline underline-offset-4"
            >
              Know me better <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 text-sm text-foreground/60 border-l-6 border-primary bg-primary/5 font-medium mt-8">
            <p className="mb-4">I'm currently available for freelance work and part-time roles.</p>
            <div className="flex gap-4 items-center">
              <Link
                href="https://mail.google.com/mail/?view=cm&fs=1&to=flxrzjr@gmail.com&su=Let's%20Build%20Something%20Amazing%20Together&body=Hi%20Felix,%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20potential%20project%20or%20opportunity.%0A%0AProject%20Overview:%20%0A%0ATimeline:%20%0A%0ABudget:%20%0A%0AAdditional%20Details:%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.%0A%0ABest%20regards,"
                target="_blank"
              >
                <Button variant="tertiary" size="sm">
                  Hire Me
                </Button>
              </Link>
              <Link
                href="/felix-ruz-cv.pdf"
                target="_blank"
                download
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all underline underline-offset-4"
              >
                Download CV
              </Link>
            </div>
          </div>

        </div>
      </section >

      {/* Tech Stack */}
      < section className="skills pb-6" >
        <TechStackMarquee />
      </section >

      {/* Projects */}
      < section className="projects bg-surface" >
        <div className={cln(
          "mx-auto py-12 space-y-8",
          projectsLoading && "max-w-7xl",
          featuredProjects.length >= 3 && "max-w-7xl",
          featuredProjects.length === 2 && "max-w-5xl",
          (featuredProjects.length <= 1 && !projectsLoading) && "max-w-3xl"
        )}>
          <div className="w-full max-w-3xl mx-auto flex items-center justify-between px-6">
            <h2 className="text-lg font-bold tracking-tight">Projects</h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all underline underline-offset-4"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div>
            {projectsLoading ? (
              <div className={cln(
                "grid gap-4 px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              )}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ProjectCardShimmer key={`project-shimmer-${idx}`} />
                ))}
              </div>
            ) : featuredProjects.length > 0 ? (
              <div className={cln(
                "grid gap-4 px-6",
                featuredProjects.length === 1 && "grid-cols-1",
                featuredProjects.length === 2 && "grid-cols-1 sm:grid-cols-2",
                featuredProjects.length >= 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              )}>
                {featuredProjects.map((project, idx) => {
                  return <ProjectCard key={`project-item-${idx}`} project={project} />
                })}
              </div>
            ) : (
              <p className="text-sm text-foreground/40 italic py-6 col-span-3">
                No projects yet.
              </p>
            )}
          </div>
        </div>
      </section >

      {/* Latest Posts */}
      < section className="posts border-b border-border" >
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Latest Posts</h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all underline underline-offset-4"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
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
      </section >

    </div >
  );
}