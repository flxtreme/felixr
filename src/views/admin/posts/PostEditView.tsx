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
import { usePostContext } from "@/src/features/admin/posts/PostsContext";
import { UpdatePostPayload, Post } from "@/src/features/admin/posts/types";
import type { Metadata } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";

export default function PostEditView() {
  const { id } = useParams();
  const router = useRouter();

  const {
    updatePost,
    tagInput,
    setTagInput,
    showSuggestions,
    setShowSuggestions,
    searchResults,
    isSearching,
  } = usePostContext();

  const { post: fetchedPost, isLoading: isFetchingPost } = usePost(id as string);
  const { content: fetchedContent } = usePostContent(id as string);
  const { metadata: fetchedMetadata } = usePostMetadata(id as string);

  const basePost = useMemo<Partial<Post>>(
    () => ({
      title: "",
      slug: "",
      content: "",
      status: "DRAFT",
      postType: "POST",
      metadata: { tags: [] },
      ...(fetchedPost ?? {}),
      ...(typeof fetchedContent !== "undefined" ? { content: fetchedContent } : {}),
      ...(fetchedMetadata
        ? {
            metadata: {
              ...(fetchedPost?.metadata ?? {}),
              ...(fetchedMetadata as Record<string, unknown>),
            },
          }
        : {}),
    }),
    [fetchedPost, fetchedContent, fetchedMetadata]
  );

  const [overrides, setOverrides] = useState<Partial<Post>>({});

  const post = useMemo(() => ({ ...basePost, ...overrides }), [basePost, overrides]);

  const setPost = (updater: (prev: Partial<Post>) => Partial<Post>) => {
    setOverrides((prev) => updater({ ...basePost, ...prev }));
  };

  const savePost = async () => {
    try {
      await updatePost(id as string, post as UpdatePostPayload);
      router.push("/admin/posts");
    } catch (err) {
      console.error("Failed to save post", err);
    }
  };

  return (
    <ManagePostLayout
      isLoading={isFetchingPost}
      pageTitle={post.title || post.slug || "Edit Post"}
      backHref="/admin/posts"
      saveLabel="Save Changes"
      onSave={savePost}
      editor={
        <PostContentEditor
          content={post.content || ""}
          onContentChange={(value) =>
            setPost((prev) => ({
              ...prev,
              content: value,
            }))
          }
          onFileUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              setPost((prev) => ({
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
              Post Details
            </h2>

            <PostMetaFields
              title={post.title || ""}
              onTitleChange={(value) =>
                setPost((prev) => ({
                  ...prev,
                  title: value,
                }))
              }
              slug={post.slug || ""}
              onSlugChange={(value) =>
                setPost((prev) => ({
                  ...prev,
                  slug: value,
                }))
              }
              excerpt={post.excerpt || ""}
              onExcerptChange={(value) =>
                setPost((prev) => ({
                  ...prev,
                  excerpt: value,
                }))
              }
            />

            <PostStatusSelector
              status={post.status || "DRAFT"}
              onStatusChange={(value) =>
                setPost((prev) => ({
                  ...prev,
                  status: value,
                }))
              }
            />

            <PostTagsInput
              tags={(post.metadata?.tags as string[]) || []}
              onAddTag={(tag) =>
                setPost((prev) => {
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
                setPost((prev) => ({
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
              metadata={post.metadata?.seo as Metadata}
              onChange={(seo) =>
                setPost((prev) => ({
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
