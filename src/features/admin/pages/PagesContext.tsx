"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchTags } from "@/src/features/admin/tags/hooks";
import { usePostActions } from "@/src/features/admin/posts/hooks";
import { CreatePostPayload, UpdatePostPayload } from "@/src/features/admin/posts/types";
import { Tag } from "@/src/features/admin/tags/types";

interface PagesContextType {
  tagInput: string;
  setTagInput: (val: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (val: boolean) => void;
  searchResults: Tag[];
  isSearching: boolean;
  createPage: (payload: CreatePostPayload) => Promise<any>;
  updatePage: (id: string, payload: UpdatePostPayload) => Promise<any>;
  removePage: (id: string) => Promise<any>;
}

const PagesContext = createContext<PagesContextType | undefined>(undefined);

export const PagesProvider = ({ children }: { children: React.ReactNode }) => {
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState("");

  const { create, update, remove } = usePostActions();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(tagInput.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [tagInput]);

  const { results, isLoading } = useSearchTags(debouncedInput);
  const isSearching = isLoading || (tagInput.trim() !== debouncedInput && tagInput.trim() !== "");

  return (
    <PagesContext.Provider
      value={{
        tagInput,
        setTagInput,
        showSuggestions,
        setShowSuggestions,
        searchResults: results,
        isSearching,
        createPage: create,
        updatePage: update,
        removePage: (id: string) => remove(id, {}),
      }}
    >
      {children}
    </PagesContext.Provider>
  );
};

export const usePagesContext = () => {
  const context = useContext(PagesContext);
  if (!context) {
    throw new Error("usePagesContext must be used within a PagesProvider");
  }
  return context;
};