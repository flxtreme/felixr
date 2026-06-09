"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";
import { useTags, useTagActions } from "@/src/features/admin/tags/hooks";
import { Tag, GetTagsQuery } from "@/src/features/admin/tags/types";

interface TagsContextType {
  tags: Tag[];
  isLoading: boolean;
  error: any;
  mutate: () => Promise<any>;
  createTag: ReturnType<typeof useTagActions>["create"];
  updateTag: ReturnType<typeof useTagActions>["update"];
  removeTag: ReturnType<typeof useTagActions>["remove"];
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export const TagsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [params, setParams] = useState<GetTagsQuery>({
    isActive: true
  });

  // Centralize tag data fetching via SWR
  const { tags, meta, isLoading, error, mutate } = useTags(params);
  
  // Extract actions for creating, updating, and removing tags
  const { create, update, remove } = useTagActions();

  return (
    <TagsContext.Provider
      value={{
        tags,
        isLoading,
        error,
        mutate,
        createTag: create,
        updateTag: update,
        removeTag: remove,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};

export const useTagsContext = () => {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error("useTagsContext must be used within a TagsProvider");
  }
  return context;
};