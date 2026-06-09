"use client";

import { TagIcon, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Tag } from "@/src/features/admin/tags/types";

interface PostTagsInputProps {
  tags?: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  // Search state passed from parent context
  tagInput: string;
  setTagInput: (val: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (val: boolean) => void;
  searchResults: Tag[];
  isSearching: boolean;
}

export const PostTagsInput = ({ 
  tags = [], 
  onAddTag, 
  onRemoveTag,
  tagInput,
  setTagInput,
  showSuggestions,
  setShowSuggestions,
  searchResults,
  isSearching
}: PostTagsInputProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSuggestions]);

  const filteredResults = searchResults.filter((tag) => !tags.includes(tag.name));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      
      // Support multiple tags via comma separation
      const segments = tagInput.split(",").map(t => t.trim()).filter(Boolean);
      segments.forEach(tag => onAddTag(tag));
      
      setTagInput("");
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-4 flex-1 min-w-[300px]">
      <label className="text-sm font-mono font-medium text-foreground/40 flex items-center gap-2">
        <TagIcon className="w-3 h-3" /> Tags
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/5 text-primary text-xs font-mono font-medium border border-primary/10 rounded">
            {tag}
            <button onClick={() => onRemoveTag(tag)} className="hover:text-red-500 transition-colors"><X className="w-2.5 h-2.5" /></button>
          </span>
        ))}
      <div className="relative min-w-[120px] flex-1" ref={containerRef}>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-b border-border py-1 text-sm font-mono font-medium focus:outline-none focus:border-primary w-full placeholder:text-foreground/10"
          placeholder="Add tag..."
        />
        {showSuggestions && tagInput.trim() && (
          <div className="absolute z-10 left-0 right-0 mt-1 bg-background border border-border rounded-sm shadow-xl max-h-48 overflow-y-auto divide-y divide-border">
            {isSearching ? (
              <div className="px-3 py-2 flex items-center justify-center">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-foreground/40" />
              </div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    onAddTag(tag.name);
                    setTagInput("");
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  {tag.name}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs font-mono text-foreground/40 italic">
                No tags found
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};