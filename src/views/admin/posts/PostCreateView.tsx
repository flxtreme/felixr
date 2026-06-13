"use client";

import { ManagePostLayout } from "@/src/layouts/ManagePostLayout";
import { PostContentEditor } from "@/src/features/admin/components/post/PostContentEditor";
import { PostMetaFields } from "@/src/features/admin/components/post/PostMetaFields";
import PostMetadataEditor from "@/src/features/admin/components/post/PostMetadataEditor";
import { PostStatusSelector } from "@/src/features/admin/components/post/PostStatusSelector";
import { PostTagsInput } from "@/src/features/admin/components/post/PostTagsInput";
import { usePostContext } from "@/src/features/admin/posts/PostsContext";
import { CreatePostPayload, Post } from "@/src/features/admin/posts/types";
import type { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostCreateView() {
  const router = useRouter();
  const {
    createPost,
    tagInput,
    setTagInput,
    showSuggestions,
    setShowSuggestions,
    searchResults,
    isSearching,
  } = usePostContext();

  const [post, setPost] = useState<Partial<Post>>({
    title: "",
    slug: "",
    content: "",
    status: "DRAFT",
    postType: "POST",
    excerpt: "",
    metadata: { tags: [] },
  });

  const savePost = async () => {
    try {
      await createPost(post as CreatePostPayload);
      router.push("/admin/posts");
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  return (
    <ManagePostLayout
      pageTitle="New Post"
      backHref="/admin/posts"
      saveLabel="Create Post"
      onSave={savePost}
      editor={
        <PostContentEditor
          content={post.content || ""}
          onContentChange={(value) => setPost((p) => ({ ...p, content: value }))}
          onFileUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => setPost((p) => ({ ...p, content: e.target?.result as string }));
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
              onTitleChange={(value) => setPost((p) => ({ ...p, title: value }))}
              slug={post.slug || ""}
              onSlugChange={(value) => setPost((p) => ({ ...p, slug: value }))}
              excerpt={post.excerpt || ""}
              onExcerptChange={(value) => setPost((p) => ({ ...p, excerpt: value }))}
            />

            <PostStatusSelector
              status={post.status || "DRAFT"}
              onStatusChange={(value) => setPost((p) => ({ ...p, status: value }))}
            />

            <PostTagsInput
              tags={(post.metadata?.tags as string[]) || []}
              onAddTag={(tag) =>
                setPost((p) => {
                  const meta = p.metadata || {};
                  const tags = (meta.tags as string[]) || [];
                  if (tags.includes(tag)) return p;
                  return { ...p, metadata: { ...meta, tags: [...tags, tag] } };
                })
              }
              onRemoveTag={(tag) =>
                setPost((p) => {
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
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-foreground/30">
              SEO Metadata
            </h2>

            <PostMetadataEditor
              metadata={post.metadata?.seo as Metadata}
              onChange={(seo) => setPost((p) => ({ ...p, metadata: { ...p.metadata, seo } }))}
            />
          </section>
        </div>
      }
    />
  );
}
