"use client";

import { ManagePostLayout } from "@/src/layouts/ManagePostLayout";
import { PostContentEditor, PostMetaFields, PostStatusSelector, PostTagsInput } from "@/src/features/admin/components/post";
import PostMetaEditor from "@/src/features/admin/components/post/PostMetadataEditor";
import { usePost } from "@/src/features/admin/posts/hooks";
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

  const { post: fetchedPost, isLoading: isFetching } = usePost(id as string);

  const [post, setPost] = useState<Partial<Post>>({
    title: "",
    slug: "",
    content: "",
    status: "DRAFT",
    postType: "POST",
    metadata: { tags: [] },
  });

  useEffect(() => {
    if (fetchedPost) setPost(fetchedPost);
  }, [fetchedPost]);

  const savePost = async () => {
    try {
      await updatePost(id as string, post as UpdatePostPayload);
      router.push("/admin/posts");
    } catch (err) {
      console.error("Failed to save post", err);
    }
  };

  if (isFetching) return <div className="p-8 font-mono text-sm opacity-40">Loading...</div>;

  return (
    <ManagePostLayout
      pageTitle={post.title || post.slug || "Edit Post"}
      backHref="/admin/posts"
      saveLabel="Save Changes"
      onSave={savePost}
      editor={
        <PostContentEditor
          content={post.content || ""}
          onContentChange={(value) => setPost((p) => ({ ...p, content: value }))}
          onFileUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              setPost((p) => ({ ...p, content: e.target?.result as string }));
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
                  const tags = (p.metadata?.tags as string[]) || [];
                  if (tags.includes(tag)) return p;
                  return { ...p, metadata: { ...p.metadata, tags: [...tags, tag] } };
                })
              }
              onRemoveTag={(tag) =>
                setPost((p) => ({
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
              metadata={post.metadata?.seo as Metadata}
              onChange={(seo) => setPost((p) => ({ ...p, metadata: { ...p.metadata, seo } }))}
            />
          </section>
        </div>
      }
    />
  );
}