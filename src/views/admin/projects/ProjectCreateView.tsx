"use client";

import { useDashboard } from "@/src/features/admin/DashboardContext";
import { usePosts } from "@/src/features/admin/posts/hooks";
import { updatePost } from "@/src/features/admin/posts/services";
import { useProjectContext } from "@/src/features/admin/project/ProjectContext";
import { ProjectLink } from "@/src/features/admin/project/types";
import { AdminUploadPickerModal } from "@/src/features/admin/uploads/AdminUploadPickerModal";
import { Edit2, Loader2, Plus, Trash2, X } from "lucide-react";
import { useModal } from "flxtheme";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AdminButton } from "@/src/features/admin/components/AdminButton";

const IMAGE_PICKER_MODAL_ID = "admin-project-create-image-picker";

export default function ProjectCreateView() {
  const router = useRouter();
  const { createProject } = useProjectContext();
  const { setGoBackUrl, setRightPanel } = useDashboard();
  const { openModal } = useModal();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageId, setPageId] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageSearch, setPageSearch] = useState("");
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [featureImages, setFeatureImages] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { posts: pages, isLoading: isLoadingPages } = usePosts({
    postType: "PAGE",
    search: pageSearch,
    limit: 50,
  });

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

  const handleAddLink = () => setLinks([...links, { label: "", href: "" }]);
  const handleRemoveLink = (i: number) => setLinks(links.filter((_, idx) => idx !== i));
  const handleLinkChange = (i: number, field: keyof ProjectLink, value: string) => {
    const next = [...links];
    next[i] = { ...next[i], [field]: value };
    setLinks(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const project = await createProject({
        title,
        description: description || null,
        pageId,
        links,
        isDeleted: false,
      });
      if (featureImages.length > 0 && project.pageId) {
        await updatePost(project.pageId, { featureImages });
      }
      router.push("/admin/projects");
    } catch (err: any) {
      setError(err.message || "Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Right panel content — re-rendered whenever deps change
  useEffect(() => {
    setRightPanel(
      <div className="flex flex-col gap-8 p-4">
        {/* Linked Page */}
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
                        setPageSlug(page.slug.toLowerCase());
                        setPageSearch(page.title || page.slug);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-primary/5 hover:text-primary transition-colors flex flex-col"
                    >
                      <span>{page.title || page.slug}</span>
                      <span className="text-[8px] opacity-40">/{page.slug.toLowerCase()}</span>
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

        {/* External Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-[10px] font-mono font-bold text-foreground/30 uppercase px-1">External Links</h2>
            <AdminButton
              type="button"
              onClick={handleAddLink}
              variant="ghost"
              className="gap-1 text-[10px] font-bold text-primary"
            >
              <Plus className="w-3 h-3" /> ADD LINK
            </AdminButton>
          </div>
          <div className="space-y-3">
            {links.map((link, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                    className="w-full h-9 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-xs font-mono"
                    placeholder="Label"
                  />
                </div>
                <div className="flex-[2] space-y-1">
                  <input
                    type="url"
                    value={link.href}
                    onChange={(e) => handleLinkChange(index, "href", e.target.value)}
                    className="w-full h-9 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-xs font-mono"
                    placeholder="URL"
                  />
                </div>
                <AdminButton
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  variant="destructive"
                  aria-label="Remove link"
                  className="size-9 p-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </AdminButton>
              </div>
            ))}
            {links.length === 0 && (
              <p className="text-[10px] font-mono text-foreground/20 italic px-1">No links added yet.</p>
            )}
          </div>
        </div>

        {/* Feature Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-[10px] font-mono font-bold text-foreground/30 uppercase px-1">Feature Images</h2>
            <AdminButton
              type="button"
              onClick={() => openModal(IMAGE_PICKER_MODAL_ID)}
              variant="ghost"
              className="gap-1 text-[10px] font-bold text-primary"
            >
              <Plus className="w-3 h-3" /> ADD IMAGE
            </AdminButton>
          </div>
          {featureImages.length === 0 ? (
            <p className="text-[10px] font-mono text-foreground/20 italic px-1">No images added yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {featureImages.map((src, i) => (
                <div key={i} className="relative group aspect-[4/3] bg-foreground/5 rounded overflow-hidden border border-border">
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  <button
                    type="button"
                    onClick={() => setFeatureImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 text-foreground/60 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
    return () => setRightPanel(null);
  }, [pageId, pageSearch, pages, isLoadingPages, showSuggestions, links, featureImages]);

  return (
    <>
      <div className="flex flex-col min-h-0 h-full">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <header className="px-8 py-6 border-b border-border shrink-0">
            <div className="max-w-3xl mx-auto space-y-1">
              <h1 className="text-2xl font-bold">Create New Project</h1>
              <p className="text-sm font-mono font-medium text-foreground/40">
                Showcase your work and portfolio
              </p>
            </div>
          </header>

          {error && (
            <div className="px-8 pt-4">
              <div className="max-w-3xl mx-auto p-3 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-mono text-red-500 uppercase">
                {error}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-foreground/30 uppercase px-1" htmlFor="create-title">
                  Project Title
                </label>
                <input
                  id="create-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono transition-shadow"
                  placeholder="e.g. My Awesome Project"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-foreground/30 uppercase px-1" htmlFor="create-description">
                  Description
                </label>
                <textarea
                  id="create-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[120px] bg-transparent border border-border p-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono transition-shadow resize-none"
                  placeholder="Briefly describe the project..."
                />
              </div>
            </div>
          </div>

          <div className="px-8 py-4 border-t border-foreground/5 shrink-0">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
              <Link href="/admin/projects">
                <AdminButton variant="outline">Cancel</AdminButton>
              </Link>
              <AdminButton type="submit" disabled={isSubmitting} variant="primary">
                {isSubmitting ? "Creating..." : "Create Project"}
              </AdminButton>
            </div>
          </div>
        </form>
      </div>

      <AdminUploadPickerModal
        id={IMAGE_PICKER_MODAL_ID}
        title="Choose feature image"
        imageOnly
        onSelect={(upload) =>
          setFeatureImages((prev) => [...prev, upload.publicPath])
        }
      />
    </>
  );
}
