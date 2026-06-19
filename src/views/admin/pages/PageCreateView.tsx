"use client";

import { ManagePostLayout } from "@/src/layouts/ManagePostLayout";
import {
  PostContentEditor,
  PostMetaFields,
  PostStatusSelector,
  PostTagsInput,
} from "@/src/features/admin/components/post";
import PostMetaEditor from "@/src/features/admin/components/post/PostMetadataEditor";
import { usePagesContext } from "@/src/features/admin/pages/PagesContext";
import { CreatePostPayload, Post } from "@/src/features/admin/posts/types";
import type { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDashboard } from "@/src/features/admin/DashboardContext";

export default function PageCreateView() {
  const router = useRouter();
  const { setGoBackUrl } = useDashboard();
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

  const savePage = async () => {
    try {
      await createPage(page as CreatePostPayload);
      router.push("/admin/pages");
    } catch (err) {
      console.error("Failed to create page", err);
    }
  };

  useEffect(() => {
    setGoBackUrl("/admin/pages");
  }, []);

  return (
    <ManagePostLayout
      pageTitle="New Page"
      backHref="/admin/pages"
      saveLabel="Create Page"
      onSave={savePage}
      editor={
        <PostContentEditor
          content={page.content || ""}
          onContentChange={(value) => setPage((p) => ({ ...p, content: value }))}
          onFileUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => setPage((p) => ({ ...p, content: e.target?.result as string }));
            reader.readAsText(file);
          }}
        />
      }
      sidebar={
        <div className="space-y-7">
          <section className="space-y-4">
            <h2 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-foreground/30">
              Page Details
            </h2>
            <PostMetaFields
              title={page.title || ""}
              onTitleChange={(value) => setPage((p) => ({ ...p, title: value }))}
              slug={page.slug || ""}
              onSlugChange={(value) => setPage((p) => ({ ...p, slug: value }))}
              excerpt={page.excerpt || ""}
              onExcerptChange={(value) => setPage((p) => ({ ...p, excerpt: value }))}
            />
            <PostStatusSelector
              status={page.status || "DRAFT"}
              onStatusChange={(value) => setPage((p) => ({ ...p, status: value }))}
            />
            <PostTagsInput
              tags={(page.metadata?.tags as string[]) || []}
              onAddTag={(tag) =>
                setPage((p) => {
                  const tags = (p.metadata?.tags as string[]) || [];
                  if (tags.includes(tag)) return p;
                  return { ...p, metadata: { ...p.metadata, tags: [...tags, tag] } };
                })
              }
              onRemoveTag={(tag) =>
                setPage((p) => ({
                  ...p,
                  metadata: {
                    ...p.metadata,
                    tags: ((p.metadata?.tags as string[]) || []).filter((t) => t !== tag),
                  },
                }))
              }
              tagInput={tagInput}
              setTagInput={setTagInput}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              searchResults={searchResults}
              isSearching={isSearching}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-foreground/30">
              SEO Metadata
            </h2>
            <PostMetaEditor
              metadata={page.metadata?.seo as Metadata}
              onChange={(seo) => setPage((p) => ({ ...p, metadata: { ...p.metadata, seo } }))}
            />
          </section>
        </div>
      }
    />
  );
}
