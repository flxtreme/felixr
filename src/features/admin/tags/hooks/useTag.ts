import useSWR from "swr";
import { getTagById } from "@/src/features/admin/tags/services";

export const useTag = (id?: string) => {
  const swr = useSWR(id ? ["tag", id] : null, () => getTagById(id as string));

  return {
    ...swr,
    tag: swr.data,
    isLoading: swr.isLoading,
  };
};
