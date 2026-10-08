"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { usePosts } from "@/src/features/public/posts/hooks";
import { useProjects } from "@/src/features/public/projects/hooks";
import { PostShimmer } from "@/src/components/shimmer/PostShimmer";
import { PostCard } from "@/src/components/PostCard";
import { SectionDivider } from "@/src/components/SectionDivider";
import { TechStackMarquee } from "@/src/features/public/components/TechStackMarquee";
import { ExperienceCard } from "@/src/features/public/components/ExperienceCard";
import { experienceAnchor } from "@/src/features/public/experience/data";
import { useExperience } from "@/src/features/public/experience/hooks/useExperience";
import { useLayout } from "@/src/layouts/LayoutContext";
import { PageDirectory } from "@/src/layouts/parts/PageDirectory";
import Image from "next/image";
import { CertificationRow } from "@/src/components/CertificationRow";
import useCertifications from "@/src/features/public/certifications/hooks/useCertifications";
import { cln } from "@/src/utils/cln";
import { formatShortDate } from "@/src/utils/date";

const homeDirectoryItems = [
  {
    label: "home",
    href: "/",
    kind: "folder" as const,
    children: [
      { label: "tools & practices", href: "/#tools", kind: "file" as const },
      { label: "projects", href: "/#projects", kind: "file" as const },
      { label: "experience", href: "/#experience", kind: "file" as const },
      { label: "certifications", href: "/#certifications", kind: "file" as const },
      { label: "blogs", href: "/#blogs", kind: "file" as const },
    ],
  },
];

const cleanExcerpt = (excerpt?: string | null) =>
  excerpt?.replace(/[#*`]/g, "").substring(0, 150) ||
  "A project built with care, curiosity, and a little bit of unreasonable ambition.";

export default function HomeView() {
  const { setRightPanel } = useLayout();
  const { posts: latestPosts, isLoading: postsLoading } = usePosts({
    postType: "POST",
    status: "PUBLISHED",
    limit: 3,
  });
  const { projects: featuredProjects, isLoading: projectsLoading } = useProjects({ limit: 3 });
  const { experience, isLoading: experienceLoading } = useExperience({ limit: 3 });
  const {
    certifications,
    error: certificationsError,
    isLoading: certificationsLoading,
  } = useCertifications({ limit: 100, offset: 0 });

  useEffect(() => {
    setRightPanel(<PageDirectory items={homeDirectoryItems} />);
    return () => setRightPanel(null);
  }, [setRightPanel]);

  return (
    <main className="overflow-hidden">
      <section id="home" className="relative overflow-hidden text-foreground">
        <div className="mx-auto max-w-3xl px-6 pb-10 pt-20 gap-6 sm:gap-10 grid grid-cols-1 sm:grid-cols-2">
          <div>
            <div className="relative mb-4 aspect-square w-full shrink-0 overflow-hidden flex items-cemter justify-center bg-surface/45">
              <Image
                src="/hero-image.png"
                alt="Felix Ruz"
                priority
                fill
                sizes="480px"
                className="object-cover scale-125 origin-top"
              />
            </div>
          </div>
          <div className="reveal-up">
            <h1 className="text-3xl font-black leading-[0.96] text-foreground sm:text-5xl">
              Felix Ruz
            </h1>
            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-foreground/75">
              Full-Stack | Agentic
            </p>
            <p className="mt-4 max-w-md text-sm leading-6 text-foreground/55">
              I&apos;m a full-stack engineer with nearly 8 years of experience building web and mobile apps.
              <br />
              <br />
              Right now I&apos;m building cloud-native, microservices-based systems and applications for airlines, and exploring how agentic workflows change the way software gets made.
            </p>
            <div className="mt-8 flex flex-wrap items-start justify-start gap-x-5 gap-y-3 font-mono text-sm text-foreground/45">
              <Link
                href="https://linkedin.com/in/flxrzjr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-primary underline underline-offset-3"
              >
                linkedin <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="https://github.com/flxtreme"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-primary underline underline-offset-3"
              >
                github <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="/gigs"
                className="inline-flex items-center gap-1 transition-colors hover:text-primary underline underline-offset-3"
              >
                gigs <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>
      <SectionDivider />
      <section id="tools">
        <div className="pb-4 pt-12">
          <div className="max-w-3xl px-6 mx-auto flex items-center justify-between mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/65">
              Tools & practices
            </p>
            <Link
              href="/stack"
              className="hidden items-center gap-2 text-sm text-primary lowercase underline underline-offset-3 md:flex"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <TechStackMarquee />
        </div>
      </section>
      <SectionDivider />
      <section id="projects">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/65">
              Projects
            </h2>
            <Link
              href="/projects"
              className="hidden items-center gap-2 text-sm text-primary lowercase underline underline-offset-3 sm:flex"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          {projectsLoading ? (
            <div>
              <PostShimmer count={3} />
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="divide-y divide-foreground/10">
              {featuredProjects.slice(0, 3).map((project) => {
                const page = project.page;
                const publishedAt = page?.publishedAt ?? page?.createdAt ?? page?.updatedAt;

                return (
                  <div key={project.id}>
                    <PostCard
                      href={`/projects/${page?.slug}`}
                      title={page?.title || project.title}
                      excerpt={cleanExcerpt(page?.excerpt || project.description)}
                      dateLabel={formatShortDate(publishedAt) || "Recent"}
                      variant="compact"
                      excerptSize="sm"
                    />
                    {project.links && project.links.length > 0 && (
                      <ul className="flex flex-wrap gap-x-4 gap-y-2 pb-4">
                        {project.links.map((link) => (
                          <li key={`${link.label}-${link.href}`}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-foreground/55 underline underline-offset-4 transition-colors hover:text-primary"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
            className="mt-8 inline-flex items-center gap-2 text-sm text-primary lowercase underline underline-offset-3 sm:hidden"
          >
            View all projects <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <SectionDivider />
      <section id="experience">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/65">
              Experience
            </h2>
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 text-sm text-primary lowercase underline underline-offset-3"
            >
              View more <ArrowRight className="size-4" />
            </Link>
          </div>
          <div>
            {experienceLoading ? (
              <div className="h-32 animate-pulse border-t border-foreground/10 bg-foreground/[0.03]" aria-label="Loading experience" />
            ) : experience.map((item) => (
              <ExperienceCard
                id={experienceAnchor(item.role)}
                key={item.id}
                role={item.role}
                company={item.company}
                start={item.start}
                end={item.end}
                responsibilities={item.responsibilities}
                showResponsibilities={false}
              />
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />
      <section id="certifications">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className={cln("font-mono text-xs uppercase tracking-[0.2em] text-foreground/65")}>
              Certifications
            </h2>
            <Link
              href="/certifications"
              className={cln("inline-flex items-center gap-2 text-sm text-primary lowercase underline underline-offset-3")}
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          {certificationsLoading ? (
            <p className={cln("py-8 text-sm text-foreground/50")} role="status">
              Loading certifications...
            </p>
          ) : certificationsError ? (
            <p className={cln("py-8 text-sm text-foreground/50")} role="alert">
              Certifications couldn&apos;t be loaded.
            </p>
          ) : certifications.length === 0 ? (
            <p className={cln("py-8 text-sm text-foreground/50")}>
              No certifications available yet.
            </p>
          ) : (
            <div>
              {certifications.slice(0, 4).map((certification) => (
                <CertificationRow key={certification.id} certification={certification} />
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionDivider />
      <section id="blogs">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/65">
              Blogs
            </h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-primary lowercase underline underline-offset-3"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          {postsLoading ? (
            <PostShimmer />
          ) : latestPosts.length > 0 ? (
            <div className="divide-y divide-foreground/10">
              {latestPosts.map((post, index) => {
                const publishedAt = post.publishedAt ?? post.createdAt;
                return (
                  <PostCard
                    key={`${post.id ?? post.slug}-${index}`}
                    href={`/blog/${post.slug}`}
                    title={post.title}
                    excerpt={cleanExcerpt(post.excerpt)}
                    dateLabel={formatShortDate(publishedAt)}
                    variant="compact"
                    excerptSize="sm"
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-foreground/45">New writing is on its way.</p>
          )}
        </div>
      </section>

      <SectionDivider />
      <section id="hire-me" className="border-b border-dashed border-foreground/10 py-8">
        <div className="mx-auto max-w-3xl px-6 py-8 bg-surface/60">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Open for work
          </p>
          <div className="mt-4 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-black text-foreground sm:text-3xl">
                Have something good in mind?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/55">
                I&apos;m available for work. Let&apos;s build something useful together.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-5">
              <a
                href="/felix-ruz-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary underline underline-offset-4 transition-[gap] hover:gap-3"
              >
                View resume <ArrowUpRight className="size-4" />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=flxrzjr%40gmail.com&su=Project%20collaboration&body=Hi%20Felix%2C%0A%0AI%27d%20like%20to%20discuss%20having%20you%20help%20with%20my%20project.%0A%0AProject%20details%3A%0A"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary underline underline-offset-4 transition-[gap] hover:gap-3"
              >
                Hire me <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
