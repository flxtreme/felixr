"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTagsContext } from "@/src/features/admin/tags/TagsContext";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/Button";

export default function TagCreateView() {
  const router = useRouter();
  const { createTag } = useTagsContext();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [excludeFromPages, setExcludeFromPages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createTag({ name, slug, excludeFromPages });
      router.push("/admin/tags");
    } catch (err: any) {
      setError(err.message || "Failed to create tag. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Basic slugify helper to auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .trim()
    );
  };

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <header className="space-y-4">
        <Link href="/admin/tags">
          <Button variant="tertiary" size="sm">
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Tags
          </Button>
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Create New Tag</h1>
          <p className="text-sm font-mono font-medium text-foreground/40">
            Define a new classification for your content
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 border border-border p-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-[10px] font-mono font-bold text-foreground/30 uppercase px-1"
              htmlFor="name"
            >
              Tag Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              className="w-full h-10 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono transition-shadow"
              placeholder="e.g. Technology"
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-[10px] font-mono font-bold text-foreground/30 uppercase px-1"
              htmlFor="slug"
            >
              Slug
            </label>
            <input
              id="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full h-10 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono transition-shadow"
              placeholder="technology"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 px-1">
            <input
              id="excludeFromPages"
              type="checkbox"
              checked={excludeFromPages}
              onChange={(e) => setExcludeFromPages(e.target.checked)}
              className="w-4 h-4 bg-transparent border border-border rounded focus:ring-offset-0 focus:ring-1 focus:ring-primary text-primary transition-all cursor-pointer"
            />
            <label
              className="text-xs font-mono font-medium text-foreground/40 cursor-pointer select-none"
              htmlFor="excludeFromPages"
            >
              Exclude this tag from public pages list
            </label>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-mono text-red-500 uppercase">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? "CREATING..." : "CREATE TAG"}
          </Button>
          <Link
            href="/admin/tags"
            className="inline-flex items-center justify-center h-10 px-4 text-sm rounded-md border border-foreground bg-transparent text-foreground hover:bg-foreground/10 transition-colors"
          >
            CANCEL
          </Link>
        </div>
      </form>
    </div>
  );
}
