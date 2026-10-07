"use client";

import { useDashboard } from "@/src/features/admin/DashboardContext";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { PostContentEditor } from "@/src/features/admin/components/post/PostContentEditor";
import PostMetadataEditor from "@/src/features/admin/components/post/PostMetadataEditor";
import { PostStatusSelector } from "@/src/features/admin/components/post/PostStatusSelector";
import { PostTagsInput } from "@/src/features/admin/components/post/PostTagsInput";
import { usePagesContext } from "@/src/features/admin/pages/PagesContext";
import { CreatePostPayload, Post } from "@/src/features/admin/posts/types";
import type { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const labelClass = "text-sm font-mono font-medium text-foreground/40";
const inputClass =
  "w-full h-10 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono transition-shadow";

export default function PageCreateView() {
  const router = useRouter();
  const { setGoBackUrl, setRightPanel } = useDashboard();
  const {
    createPage,
    tagInput,
    setTagInput,
    showSuggestions,
    setShowSuggestions,
    searchResults,
    isSearching,
  } = usePagesContext();

  const [page, setPage] = useState<Partial<Post>>({
    title: "",
    slug: "",
    content: "",
    status: "DRAFT",
    postType: "PAGE",
    excerpt: "",
    metadata: { tags: [] },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGoBackUrl("/admin/pages");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await createPage(page as CreatePostPayload);
      router.push("/admin/pages");
    } catch (err: any) {
      setError(err.message || "Failed to create page. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Right panel content — re-rendered whenever deps change
  useEffect(() => {
    setRightPanel(
      <div className="flex flex-col gap-6 px-4 pb-4 pt-8 w-full">
        {/* SEO Metadata */}
        <PostMetadataEditor
          metadata={page.metadata?.seo as Metadata}
          onChange={(seo) =>
            setPage((p) =>
              JSON.stringify(p.metadata?.seo) === JSON.stringify(seo)
                ? p
                : { ...p, metadata: { ...p.metadata, seo } }
            )
          }
        />
      </div>
    );
    return () => setRightPanel(null);
  }, [page.status, page.metadata, tagInput, showSuggestions, searchResults, isSearching]);

  return (
    <div className="flex flex-col min-h-0 h-full pt-10">
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        <header className="px-8 pb-6 pt-10 border-b border-border shrink-0">
          <div className="max-w-3xl mx-auto space-y-1">
            <h1 className="text-2xl font-bold">Create New Page</h1>
            <p className="text-sm font-mono font-medium text-foreground/40">
              Write and publish your content
            </p>
          </div>
        </header>

        {error && (
          <div className="px-8 pt-4">
            <div className="max-w-3xl mx-auto p-3 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-mono text-red-500 uppercase">
              {error}
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="h-full grid grid-cols-1 xl:grid-cols-5 gap-6 max-w-7xl mx-auto px-6">
            <div className="py-6 h-full xl:col-span-3 xl:border-r xl:border-dashed xl:border-foreground/20 pr-6">
              <div className="h-full flex flex-col">
                <PostContentEditor
                  content={page.content || ""}
                  onContentChange={(value) => setPage((p) => ({ ...p, content: value }))}
                  onFileUpload={(file) => {
                    const reader = new FileReader();
                    reader.onload = (e) =>
                      setPage((p) => ({ ...p, content: (e.target?.result as string) || "" }));
                    reader.readAsText(file);
                  }}
                />
              </div>
            </div>
            <div className="space-y-4 py-6 h-full xl:col-span-2">
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="create-title">
                  Page Title
                </label>
                <input
                  id="create-title"
                  type="text"
                  required
                  value={page.title || ""}
                  onChange={(e) => setPage((p) => ({ ...p, title: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. About Us"
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="create-slug">
                  Slug
                </label>
                <input
                  id="create-slug"
                  type="text"
                  value={page.slug || ""}
                  onChange={(e) => setPage((p) => ({ ...p, slug: e.target.value }))}
                  className={inputClass}
                  placeholder="about-us"
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="create-excerpt">
                  Excerpt
                </label>
                <textarea
                  id="create-excerpt"
                  value={page.excerpt || ""}
                  onChange={(e) => setPage((p) => ({ ...p, excerpt: e.target.value }))}
                  className="w-full min-h-[120px] bg-transparent border border-border p-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono transition-shadow resize-none"
                  placeholder="Briefly summarize the page..."
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <PostStatusSelector
                  status={page.status || "DRAFT"}
                  onStatusChange={(value) => setPage((p) => ({ ...p, status: value }))}
                />
              </div>
              <div className="space-y-1.5">
                <PostTagsInput
                  tags={(page.metadata?.tags as string[]) || []}
                  onAddTag={(tag) =>
                    setPage((p) => {
                      const meta = p.metadata || {};
                      const tags = (meta.tags as string[]) || [];
                      if (tags.includes(tag)) return p;
                      return { ...p, metadata: { ...meta, tags: [...tags, tag] } };
                    })
                  }
                  onRemoveTag={(tag) =>
                    setPage((p) => {
                      const meta = p.metadata || {};
                      const tags = (meta.tags as string[]) || [];
                      return { ...p, metadata: { ...meta, tags: tags.filter((t) => t !== tag) } };
                    })
                  }
                  tagInput={tagInput}
                  setTagInput={setTagInput}
                  showSuggestions={showSuggestions}
                  setShowSuggestions={setShowSuggestions}
                  searchResults={searchResults}
                  isSearching={isSearching}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-4 border-t border-foreground/5 shrink-0">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <Link href="/admin/pages">
              <AdminButton variant="outline">Cancel</AdminButton>
            </Link>
            <AdminButton type="submit" disabled={isSubmitting} variant="primary">
              {isSubmitting ? "Creating..." : "Create Page"}
            </AdminButton>
          </div>
        </div>
      </form>
    </div>
  );
}