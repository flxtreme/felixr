import useSWR from "swr";

import { getPosts } from "@/src/features/public/posts/services";

import type { GetPostsQuery } from "@/src/features/public/posts/types";

const usePosts = (params?: GetPostsQuery) => {
  const key = ["posts", params];

  const swr = useSWR(key, () => getPosts(params));

  return {
    ...swr,
    posts: swr.data?.data ?? [],
    meta: swr.data?.meta,
    isLoading: swr.isLoading,
  };
};

export default usePosts;
