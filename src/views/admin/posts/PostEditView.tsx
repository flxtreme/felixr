"use client";

import { ManagePostLayout } from "@/src/layouts/ManagePostLayout";
import {
  PostContentEditor,
  PostMetaFields,
  PostStatusSelector,
  PostTagsInput,
} from "@/src/features/admin/components/post";
import PostMetaEditor from "@/src/features/admin/components/post/PostMetadataEditor";
import {
  usePost,
  usePostContent,
  usePostMetadata,
} from "@/src/features/admin/posts/hooks";
import { usePostContext } from "@/src/features/admin/posts/PostsContext";
import { UpdatePostPayload, Post } from "@/src/features/admin/posts/types";
import type { Metadata } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  const { post: fetchedPost, isLoading: isFetchingPost } = usePost(
    id as string
  );

  const { content: fetchedContent } = usePostContent(id as string);

  const { metadata: fetchedMetadata } = usePostMetadata(id as string);

  const [post, setPost] = useState<Partial<Post>>({
    title: "",
    slug: "",
    content: "",
    status: "DRAFT",
    postType: "POST",
    metadata: {
      tags: [],
    },
  });

  useEffect(() => {
    if (!fetchedPost) return;

    setPost((prev) => ({
      ...prev,
      ...fetchedPost,
    }));
  }, [fetchedPost]);

  useEffect(() => {
    if (typeof fetchedContent === "undefined") return;

    setPost((prev) => ({
      ...prev,
      content: fetchedContent,
    }));
  }, [fetchedContent]);

  useEffect(() => {
    if (!fetchedMetadata) return;

    setPost((prev) => ({
      ...prev,
      metadata: {
        ...(prev.metadata || {}),
        ...(fetchedMetadata as any),
      },
    }));
  }, [fetchedMetadata]);

  const savePost = async () => {
    try {
      await updatePost(id as string, post as UpdatePostPayload);
      router.push("/admin/posts");
    } catch (err) {
      console.error("Failed to save post", err);
    }
  };

  if (isFetchingPost) {
    return (
      <div className="p-8 font-mono text-sm opacity-40">
        Loading post...
      </div>
    );
  }

  return (
    <ManagePostLayout
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
                  const tags =
                    (prev.metadata?.tags as string[]) || [];

                  if (tags.includes(tag)) {
                    return prev;
                  }

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
                    tags:
                      ((prev.metadata?.tags as string[]) || []).filter(
                        (t) => t !== tag
                      ),
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