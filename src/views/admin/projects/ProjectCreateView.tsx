"use client";

import { Button } from "@/src/components/Button";
import { useDashboard } from "@/src/features/admin/DashboardContext";
import { usePosts } from "@/src/features/admin/posts/hooks";
import { useProjectContext } from "@/src/features/admin/project/ProjectContext";
import { ProjectLink } from "@/src/features/admin/project/types";
import { Edit2, ExternalLink, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function ProjectCreateView() {
  const router = useRouter();
  const { createProject } = useProjectContext();
  const { setGoBackUrl } = useDashboard();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageId, setPageId] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageSearch, setPageSearch] = useState("");
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGoBackUrl("/admin/projects");
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { posts: pages, isLoading: isLoadingPages } = usePosts({
    postType: "PAGE",
    search: pageSearch,
    limit: 50,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddLink = () => {
    setLinks([...links, { label: "", href: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: keyof ProjectLink, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createProject({
        title,
        description: description || null,
        pageId,
        links,
        isDeleted: false,
      });
      router.push("/admin/projects");
    } catch (err: any) {
      setError(err.message || "Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewUrl = pageSlug ? `/projects/${pageSlug}` : null;

  return (
    <div className="h-full flex flex-col">

      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 min-h-0">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0 overflow-y-auto border-r border-border space-y-8">
          <header className="px-8 py-5 border-b border-border shrink-0 px-8 pb-4 pt-8">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Create New Project</h1>
              <p className="text-sm font-mono font-medium text-foreground/40">
                Showcase your work and portfolio
              </p>
            </div>
          </header>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-mono text-red-500 uppercase">
              {error}
            </div>
          )}

          <div className="flex flex-1 flex-col overflow-x-hidden px-8 py-4 space-y-8">

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-foreground/30 uppercase px-1" htmlFor="title">
                    Project Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono transition-shadow"
                    placeholder="e.g. My Awesome Project"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-foreground/30 uppercase px-1" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[100px] bg-transparent border border-border p-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono transition-shadow resize-none"
                    placeholder="Briefly describe the project..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-mono font-bold text-foreground/30 uppercase">
                    Linked Page
                  </label>
                  {pageId && (
                    <Link
                      href={`/admin/pages/${pageId}`}
                      className="text-[10px] font-mono font-bold text-primary hover:underline flex items-center gap-1"
                      target="_blank"
                    >
                      <Edit2 className="w-3 h-3" /> EDIT PAGE
                    </Link>
                  )}
                </div>
                <div className="relative" ref={containerRef}>
                  <input
                    type="text"
                    value={pageSearch}
                    onChange={(e) => {
                      setPageSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full h-10 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono transition-shadow"
                    placeholder="Search and select a page..."
                    required
                  />
                  {showSuggestions && pageSearch.trim() && (
                    <div className="absolute z-10 left-0 right-0 mt-1 bg-background border border-border rounded-sm shadow-xl max-h-48 overflow-y-auto divide-y divide-border">
                      {isLoadingPages ? (
                        <div className="px-3 py-2 flex items-center justify-center">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-foreground/40" />
                        </div>
                      ) : pages.length > 0 ? (
                        pages.map((page) => (
                          <button
                            key={page.id}
                            type="button"
                            onClick={() => {
                              setPageId(page.id);
                              setPageSlug(page.slug);
                              setPageSearch(page.title || page.slug);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-primary/5 hover:text-primary transition-colors flex flex-col"
                          >
                            <span>{page.title || page.slug}</span>
                            <span className="text-[8px] opacity-40">/{page.slug}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-xs font-mono text-foreground/40 italic">
                          No pages found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h2 className="text-[10px] font-mono font-bold text-foreground/30 uppercase px-1">External Links</h2>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="text-[10px] font-mono font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> ADD LINK
                </button>
              </div>

              <div className="space-y-3">
                {links.map((link, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                        className="w-full h-9 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-xs font-mono"
                        placeholder="Label (e.g. GitHub)"
                      />
                    </div>
                    <div className="flex-[2] space-y-1">
                      <input
                        type="url"
                        value={link.href}
                        onChange={(e) => handleLinkChange(index, "href", e.target.value)}
                        className="w-full h-9 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-xs font-mono"
                        placeholder="URL (https://...)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="h-9 w-9 flex items-center justify-center border border-border rounded text-foreground/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {links.length === 0 && (
                  <p className="text-[10px] font-mono text-foreground/20 italic px-1">No links added yet.</p>
                )}
              </div>
            </div>
          </div>



          <div className="px-8 py-4 border-t border-foreground/5 shadow-md flex items-center justify-between gap-4">
            <Link
              href="/admin/projects"
            >
              <Button
                variant="tertiary"
              >
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} variant="primary">
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>

        {/* Right: Live preview */}
        <div className="border-border flex flex-col h-full min-h-0">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-foreground/[0.02] shrink-0">
            <span className="text-[10px] font-mono font-bold text-foreground/30 uppercase">Page Preview</span>
            <div className="flex items-center gap-3">
              {previewUrl && (
                <>
                  <button
                    type="button"
                    onClick={() => setPreviewKey((k) => k + 1)}
                    className="text-foreground/40 hover:text-primary transition-colors"
                    title="Refresh preview"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <Link href={previewUrl} target="_blank" className="text-foreground/40 hover:text-primary transition-colors" title="Open in new tab">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden bg-foreground/[0.02]">
            {previewUrl ? (
              <iframe
                key={previewKey}
                src={previewUrl}
                title="Project page preview"
                className="w-full h-full bg-background"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[11px] font-mono text-foreground/30 italic px-6 text-center">
                  Select a linked page to preview it here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}