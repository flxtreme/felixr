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
import { usePostContext } from "@/src/features/admin/posts/PostsContext";

export default function PostCreateView() {
  const router = useRouter();
  const { 
    createPost,
    tagInput,
    setTagInput,
    showSuggestions,
    setShowSuggestions,
    searchResults,
    isSearching
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
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <header className="h-12 border-b border-border flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-sm font-bold">New Post</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={savePost}
            className="text-xs font-mono font-medium text-primary hover:underline flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Create Post
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32">
        {/* Meta Fields */}
        <PostMetaFields
          title={post.title || ""}
          onTitleChange={(value) => setPost(p => ({ ...p, title: value }))}
          slug={post.slug || ""}
          onSlugChange={(value) => setPost((p) => ({ ...p, slug: value }))}
          excerpt={post.excerpt || ""}
          onExcerptChange={(value) => setPost(p => ({ ...p, excerpt: value }))}
        />

        {/* Status & Tags */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <PostStatusSelector
              status={post.status || "DRAFT"}
              onStatusChange={(value) => setPost((p) => ({ ...p, status: value }))}
            />
          </div>

          <div className="md:col-span-2">
            <PostTagsInput
              tags={(post.metadata?.tags as string[]) || []}
              onAddTag={(tag) =>
                setPost((p) => {
                  const metadata = p.metadata || {};
                  const tags = (metadata.tags as string[]) || [];
                  if (tags.includes(tag)) return p;
                  return { ...p, metadata: { ...metadata, tags: [...tags, tag] } };
                })
              }
              onRemoveTag={(tag) =>
                setPost((p) => {
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

        {/* Content Editor */}
        <PostContentEditor
          content={post.content || ""}
          onContentChange={(value) => setPost((p) => ({ ...p, content: value }))}
          onFileUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => setPost(p => ({ ...p, content: e.target?.result as string }));
            reader.readAsText(file);
          }}
        />

        {/* SEO Metadata Builder */}
        <MetadataBuilder 
          metadata={post.metadata?.seo as Metadata}
          onChange={(seo) => setPost(p => ({
            ...p,
            metadata: { ...p.metadata, seo }
          }))}
        />
      </div>
    </div>
  );
}