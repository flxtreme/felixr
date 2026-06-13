import useSWR from "swr";

import { getPostBySlug } from "@/src/features/public/posts/services";

const usePostBySlug = (slug?: string) => {
  const swr = useSWR(slug ? ["post-slug", slug] : null, () => getPostBySlug(slug as string));

  return {
    ...swr,
    post: swr.data,
    isLoading: swr.isLoading,
  };
};

export default usePostBySlug;
