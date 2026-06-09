"use client";

import { PostContentEditor, PostMetaFields, PostStatusSelector, PostTagsInput } from "@/src/features/admin/components/post";
import MetadataBuilder from "@/src/features/admin/components/post/PostMetadataEditor";
import { usePost } from "@/src/features/admin/posts/hooks";
import { UpdatePostPayload } from "@/src/features/admin/posts/types";
import { Post } from "@/src/features/admin/posts/types";
import type { Metadata } from "next";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePagesContext } from "@/src/features/admin/pages/PagesContext";

export default function PageEditView() {
  const { id } = useParams();
  const router = useRouter();
  const {
    updatePage,
    tagInput,
    setTagInput,
    showSuggestions,
    setShowSuggestions,
    searchResults,
    isSearching,
  } = usePagesContext();

  const { post: fetchedPage, isLoading: isFetching } = usePost(id as string);

  // FIXED: renamed from `page` to `pageData` to avoid shadowing Next.js router internals
  const [pageData, setPageData] = useState<Partial<Post>>({
    title: "",
    slug: "",
    content: "",
    status: "DRAFT",
    postType: "PAGE",
    metadata: { tags: [] },
  });

  useEffect(() => {
    if (fetchedPage) {
      setPageData(fetchedPage);
    }
  }, [fetchedPage]);

  const savePage = async () => {
    try {
      await updatePage(id as string, pageData as UpdatePostPayload);
      router.push("/admin/pages");
    } catch (err) {
      console.error("Failed to update page", err);
    }
  };

  if (isFetching) return <div className="p-8 font-mono text-sm opacity-40">Loading...</div>;

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="h-12 border-b border-border flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-sm font-bold truncate max-w-[300px]">
            {pageData.title || pageData.slug || "Edit Page"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={savePage}
            className="text-xs font-mono font-medium text-primary hover:underline flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32">
        <PostMetaFields
          title={pageData.title || ""}
          onTitleChange={(value) => setPageData(p => ({ ...p, title: value }))}
          slug={pageData.slug || ""}
          onSlugChange={(value) => setPageData((p) => ({ ...p, slug: value }))}
          excerpt={pageData.excerpt || ""}
          onExcerptChange={(value) => setPageData(p => ({ ...p, excerpt: value }))}
        />

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <PostStatusSelector
              status={pageData.status || "DRAFT"}
              onStatusChange={(value) => setPageData((p) => ({ ...p, status: value }))}
            />
          </div>

          <div className="md:col-span-2">
            <PostTagsInput
              tags={(pageData.metadata?.tags as string[]) || []}
              onAddTag={(tag) =>
                setPageData((p) => {
                  const metadata = p.metadata || {};
                  const tags = (metadata.tags as string[]) || [];
                  if (tags.includes(tag)) return p;
                  return { ...p, metadata: { ...metadata, tags: [...tags, tag] } };
                })
              }
              onRemoveTag={(tag) =>
                setPageData((p) => {
                  const metadata = p.metadata || {};
                  const tags = (metadata.tags as string[]) || [];
                  return {
                    ...p,
                    metadata: { ...metadata, tags: tags.filter((t) => t !== tag) },
                  };
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
        </section>

        <PostContentEditor
          content={pageData.content || ""}
          onContentChange={(value) => setPageData((p) => ({ ...p, content: value }))}
          // FIXED: only update content field, not entire state; use functional updater
          onFileUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              setPageData((p) => ({ ...p, content: e.target?.result as string }));
            reader.readAsText(file);
          }}
        />

        {/* SEO Metadata Builder */}
        <MetadataBuilder 
          metadata={pageData.metadata?.seo as Metadata}
          onChange={(seo) => setPageData((p) => ({
            ...p,
            metadata: { ...p.metadata, seo }
          }))}
        />
      </div>
    </div>
  );
}