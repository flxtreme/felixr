"use client";

import { ManagePostLayout } from "@/src/layouts/ManagePostLayout";
import { PostContentEditor, PostMetaFields, PostStatusSelector, PostTagsInput } from "@/src/features/admin/components/post";
import PostMetaEditor from "@/src/features/admin/components/post/PostMetadataEditor";
import { usePost } from "@/src/features/admin/posts/hooks";
import { usePagesContext } from "@/src/features/admin/pages/PagesContext";
import { UpdatePostPayload, Post } from "@/src/features/admin/posts/types";
import type { Metadata } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  const [pageData, setPageData] = useState<Partial<Post>>({
    title: "",
    slug: "",
    content: "",
    status: "DRAFT",
    postType: "PAGE",
    metadata: { tags: [] },
  });

  useEffect(() => {
    if (fetchedPage) setPageData(fetchedPage);
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
    <ManagePostLayout
      pageTitle={pageData.title || pageData.slug || "Edit Page"}
      backHref="/admin/pages"
      saveLabel="Save Changes"
      onSave={savePage}
      editor={
        <PostContentEditor
          content={pageData.content || ""}
          onContentChange={(value) => setPageData((p) => ({ ...p, content: value }))}
          onFileUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              setPageData((p) => ({ ...p, content: e.target?.result as string }));
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
              title={pageData.title || ""}
              onTitleChange={(value) => setPageData((p) => ({ ...p, title: value }))}
              slug={pageData.slug || ""}
              onSlugChange={(value) => setPageData((p) => ({ ...p, slug: value }))}
              excerpt={pageData.excerpt || ""}
              onExcerptChange={(value) => setPageData((p) => ({ ...p, excerpt: value }))}
            />
            <PostStatusSelector
              status={pageData.status || "DRAFT"}
              onStatusChange={(value) => setPageData((p) => ({ ...p, status: value }))}
            />
            <PostTagsInput
              tags={(pageData.metadata?.tags as string[]) || []}
              onAddTag={(tag) =>
                setPageData((p) => {
                  const tags = (p.metadata?.tags as string[]) || [];
                  if (tags.includes(tag)) return p;
                  return { ...p, metadata: { ...p.metadata, tags: [...tags, tag] } };
                })
              }
              onRemoveTag={(tag) =>
                setPageData((p) => ({
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
              metadata={pageData.metadata?.seo as Metadata}
              onChange={(seo) => setPageData((p) => ({ ...p, metadata: { ...p.metadata, seo } }))}
            />
          </section>
        </div>
      }
    />
  );
}