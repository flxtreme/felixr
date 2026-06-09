"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchTags } from "@/src/features/admin/tags/hooks";
import { usePostActions } from "@/src/features/admin/posts/hooks";
import { CreatePostPayload, UpdatePostPayload } from "@/src/features/admin/posts/types";
import { Tag } from "@/src/features/admin/tags/types";

interface PostContextType {
  tagInput: string;
  setTagInput: (val: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (val: boolean) => void;
  searchResults: Tag[];
  isSearching: boolean;
  createPost: (payload: CreatePostPayload) => Promise<any>;
  updatePost: (id: string, payload: UpdatePostPayload) => Promise<any>;
  removePost: (id: string) => Promise<any>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState("");

  const { create, update, remove } = usePostActions();

  // Debounce the tag input to optimize API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(tagInput.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [tagInput]);

  const { results, isLoading } = useSearchTags(debouncedInput);
  const isSearching = isLoading || (tagInput.trim() !== debouncedInput && tagInput.trim() !== "");

  return (
    <PostContext.Provider
      value={{
        tagInput,
        setTagInput,
        showSuggestions,
        setShowSuggestions,
        searchResults: results,
        isSearching,
        createPost: create,
        updatePost: update,
        removePost: (id: string) => remove(id, {}),
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};