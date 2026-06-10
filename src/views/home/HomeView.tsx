"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePosts } from "@/src/features/public/posts/hooks";

const navItems = [
  { label: 'Projects', path: '/projects' },
  { label: 'Posts', path: '/blog' },
];

export default function HomeView() {
  const { posts: latestPosts, isLoading: postsLoading } = usePosts({
    postType: "POST",
    status: "PUBLISHED",
    limit: 3,
  });

  const { posts: featuredProjects, isLoading: projectsLoading } = usePosts({
    postType: "PAGE",
    status: "PUBLISHED",
    tags: ["project"],
    limit: 3,
  });

  return (
    <div className="flex flex-col">
      {/* 1st Section: About */}
      <section>
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-6 space-y-4">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-primary">
              felixr
            </h1>
          </div>
          
          <p className="text-lg font-medium text-foreground/60 leading-relaxed max-w-xl">
            A space for code, learning, and growth.
          </p>

          <Link 
            href="/about" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all underline underline-offset-4"
          >
            More about my background <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="border-b border-border">
        <nav className="max-w-3xl mx-auto px-6 py-6 flex flex-wrap gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-lg font-medium transition-all hover:text-primary hover:underline underline-offset-4 text-foreground/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </section>

      {/* 2nd Section: Latest Posts Listing */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
          <h2 className="text-2xl font-bold">Latest Posts</h2>

          <div className="flex flex-col gap-10">
          {postsLoading ? (
            <p className="text-sm font-mono text-foreground/40 animate-pulse">Loading latest posts...</p>
          ) : latestPosts.length > 0 ? (
            latestPosts.map((post, idx) => (
            <article key={`${post.id}-${idx}}`} className="group relative flex flex-col items-start">
              <time 
                className="order-first mb-1 flex items-center text-sm font-medium text-foreground/40 font-mono" 
                dateTime={post.publishedAt || undefined}
              >
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric'
                }) : 'Draft'}
              </time>
              <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title || post.slug.replace(/-/g, ' ')}
                </Link>
              </h3>
              <p className="mt-1 text-sm font-medium text-foreground/60 leading-6 line-clamp-3">
                {post.content.replace(/[#*`]/g, '').substring(0, 180)}...
              </p>
            </article>
            ))
          ) : (
            <p className="text-sm font-medium text-foreground/40 italic">No posts published yet.</p>
          )}
          </div>
          <Link href="/blog" className="inline-block text-sm font-medium text-foreground/60 hover:text-primary hover:underline underline-offset-4 transition-all">View all posts</Link>
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
          <h2 className="text-2xl font-bold">Featured Projects</h2>

          <div className="flex flex-col gap-10">
          {projectsLoading ? (
            <p className="text-sm font-mono text-foreground/40 animate-pulse">Loading featured projects...</p>
          ) : featuredProjects.length > 0 ? (
            featuredProjects.map((project, idx) => (
            <article key={`${project.id}-${idx}`} className="group relative flex flex-col items-start">
              <span className="order-first mb-1 flex items-center text-sm font-medium text-foreground/40 font-mono">
                {new Date(project.publishedAt || 0).getFullYear()}
              </span>
              <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                <Link href={`/projects/${project.slug}`}>
                  {project.title}
                </Link>
              </h3>
              <p className="mt-1 text-sm font-medium text-foreground/60 leading-6 line-clamp-3">
                {project.content.replace(/[#*`]/g, '').substring(0, 180)}...
              </p> 
            </article>
            ))
          ) : (
            <p className="text-sm font-medium text-foreground/40 italic">No featured projects yet.</p>
          )}
          </div>
          <Link href="/projects" className="inline-block text-sm font-medium text-foreground/60 hover:text-primary hover:underline underline-offset-4 transition-all">View all projects</Link>
        </div>
      </section>
    </div>
  );
}
