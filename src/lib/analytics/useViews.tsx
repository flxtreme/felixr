"use client";

import useSWR from "swr";
import { fetcher } from "@/src/utils/fetcher";
import { cln } from "@/src/utils/cln";

export function useViews(path: string[]) {
  const { data, error, isLoading } = useSWR<{ views: number }>(
    `/track/views?path=${encodeURIComponent(path.join("/"))}`,
    fetcher
  );

  return {
    views: data?.views ?? 0,
    isLoading,
    isError: !!error,
  };
}

export function PageViews({ path, className }: { path: string[]; className?: string }) {
  const { views, isLoading } = useViews(path);

  return (
    <span className={cln("text-sm text-foreground/60 font-mono", className)}>
      {isLoading ? "..." : `${views} views`}
    </span>
  );
}
