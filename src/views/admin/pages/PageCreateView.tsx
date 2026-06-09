"use client";

import { PostContentEditor, PostMetaFields, PostStatusSelector, PostTagsInput } from "@/src/features/admin/components/post";
import MetadataBuilder from "@/src/features/admin/components/post/PostMetadataEditor";
import { CreatePostPayload } from "@/src/features/admin/posts/types";
import { Post } from "@/src/features/admin/posts/types";
import { ArrowLeft, Save } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePagesContext } from "@/src/features/admin/pages/PagesContext";

export default function PageCreateView() {
  const router = useRouter();
  const { 
    createPage,
    tagInput,
    setTagInput,
    showSuggestions,
    setShowSuggestions,
    searchResults,
    isSearching
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

  const savePage = async () => {
    try {
      await createPage(page as CreatePostPayload);
      router.push("/admin/pages");
    } catch (err) {
      console.error("Failed to create page", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <header className="h-12 border-b border-border flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-sm font-bold truncate max-w-[300px]">
            New Page
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={savePage}
            className="text-sm font-mono font-medium text-primary hover:underline flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Save Page
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32">
        {/* Meta Fields */}
        <PostMetaFields
          title={page.title || ""}
          onTitleChange={(value) => setPage(p => ({ ...p, title: value }))}
          slug={page.slug || ""}
          onSlugChange={(value) => setPage(p => ({ ...p, slug: value }))}
          excerpt={page.excerpt || ""}
          onExcerptChange={(value) => setPage(p => ({ ...p, excerpt: value }))}
        />

        {/* Status & Tags */}
        <section className="flex flex-wrap gap-12">
          <PostStatusSelector
            status={page.status || "DRAFT"}
            onStatusChange={(value) => setPage({ ...page, status: value })}
          />

          <PostTagsInput
            tags={page.metadata?.tags as string[]}
            onAddTag={(tag) => setPage(p => {
              const tags = (p.metadata?.tags as string[]) || [];
              if (tags.includes(tag)) return p;
              return { ...p, metadata: { ...p.metadata, tags: [...tags, tag] } };
            })}
            onRemoveTag={(tag) => setPage(p => ({
              ...p,
              metadata: {
                ...p.metadata,
                tags: ((p.metadata?.tags as string[]) || []).filter((t) => t !== tag),
              },
            }))}
            tagInput={tagInput}
            setTagInput={setTagInput}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            searchResults={searchResults}
            isSearching={isSearching}
          />
        </section>

        {/* Content Editor */}
        <PostContentEditor
          content={page.content || ""}
          onContentChange={(value) => setPage({ ...page, content: value })}
          onFileUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => setPage(p => ({ ...p, content: e.target?.result as string }));
            reader.readAsText(file);
          }}
        />

        {/* SEO Metadata Builder */}
        <MetadataBuilder 
          metadata={page.metadata?.seo as Metadata}
          onChange={(seo) => setPage(p => ({
            ...p,
            metadata: { ...p.metadata, seo }
          }))}
        />
      </div>
    </div>
  );
}