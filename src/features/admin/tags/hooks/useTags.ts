import useSWR from "swr";
import { getTags } from "@/src/features/admin/tags/services";
import type { GetTagsQuery } from "@/src/features/admin/tags/types";

export const useTags = (params?: GetTagsQuery) => {
  const key = ["tags", params];

  const swr = useSWR(key, () => getTags(params));

  return {
    ...swr,
    tags: swr.data?.data ?? [],
    meta: swr.data?.meta,
    isLoading: swr.isLoading,
  };
};
