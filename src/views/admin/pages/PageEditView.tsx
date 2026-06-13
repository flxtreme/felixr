"use client";

import { ManagePostLayout } from "@/src/layouts/ManagePostLayout";
import {
  PostContentEditor,
  PostMetaFields,
  PostStatusSelector,
  PostTagsInput,
} from "@/src/features/admin/components/post";
import PostMetaEditor from "@/src/features/admin/components/post/PostMetadataEditor";
import { usePost, usePostContent, usePostMetadata } from "@/src/features/admin/posts/hooks";
import { usePagesContext } from "@/src/features/admin/pages/PagesContext";
import { UpdatePostPayload, Post } from "@/src/features/admin/posts/types";
import type { Metadata } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";

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

  const { post: fetchedPage, isLoading: isFetchingPage } = usePost(id as string);
  const { content: fetchedContent } = usePostContent(id as string);
  const { metadata: fetchedMetadata } = usePostMetadata(id as string);

  const basePage = useMemo<Partial<Post>>(
    () => ({
      title: "",
      slug: "",
      content: "",
      status: "DRAFT",
      postType: "PAGE",
      metadata: { tags: [] },
      ...(fetchedPage ?? {}),
      ...(typeof fetchedContent !== "undefined" ? { content: fetchedContent } : {}),
      ...(fetchedMetadata
        ? {
            metadata: {
              ...(fetchedPage?.metadata ?? {}),
              ...(fetchedMetadata as Record<string, unknown>),
            },
          }
        : {}),
    }),
    [fetchedPage, fetchedContent, fetchedMetadata]
  );

  const [overrides, setOverrides] = useState<Partial<Post>>({});

  const pageData = useMemo(() => ({ ...basePage, ...overrides }), [basePage, overrides]);

  const setPageData = (updater: (prev: Partial<Post>) => Partial<Post>) => {
    setOverrides((prev) => updater({ ...basePage, ...prev }));
  };

  const savePage = async () => {
    try {
      await updatePage(id as string, pageData as UpdatePostPayload);
      router.push("/admin/pages");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ManagePostLayout
      isLoading={isFetchingPage}
      pageTitle={pageData.title || pageData.slug || "Edit Page"}
      backHref="/admin/pages"
      saveLabel="Save Changes"
      onSave={savePage}
      editor={
        <PostContentEditor
          content={pageData.content || ""}
          onContentChange={(value) =>
            setPageData((prev) => ({
              ...prev,
              content: value,
            }))
          }
          onFileUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              setPageData((prev) => ({
                ...prev,
                content: e.target?.result as string,
              }));
            };
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
              onTitleChange={(value) =>
                setPageData((prev) => ({
                  ...prev,
                  title: value,
                }))
              }
              slug={pageData.slug || ""}
              onSlugChange={(value) =>
                setPageData((prev) => ({
                  ...prev,
                  slug: value,
                }))
              }
              excerpt={pageData.excerpt || ""}
              onExcerptChange={(value) =>
                setPageData((prev) => ({
                  ...prev,
                  excerpt: value,
                }))
              }
            />

            <PostStatusSelector
              status={pageData.status || "DRAFT"}
              onStatusChange={(value) =>
                setPageData((prev) => ({
                  ...prev,
                  status: value,
                }))
              }
            />

            <PostTagsInput
              tags={(pageData.metadata?.tags as string[]) || []}
              onAddTag={(tag) =>
                setPageData((prev) => {
                  const tags = (prev.metadata?.tags as string[]) || [];
                  if (tags.includes(tag)) return prev;
                  return {
                    ...prev,
                    metadata: {
                      ...(prev.metadata || {}),
                      tags: [...tags, tag],
                    },
                  };
                })
              }
              onRemoveTag={(tag) =>
                setPageData((prev) => ({
                  ...prev,
                  metadata: {
                    ...(prev.metadata || {}),
                    tags: ((prev.metadata?.tags as string[]) || []).filter((t) => t !== tag),
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
              onChange={(seo) =>
                setPageData((prev) => ({
                  ...prev,
                  metadata: {
                    ...(prev.metadata || {}),
                    seo,
                  },
                }))
              }
            />
          </section>
        </div>
      }
    />
  );
}
