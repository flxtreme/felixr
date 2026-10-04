import useSWR from "swr";
import { getGigs } from "@/src/features/public/gigs/services";
import type { GetGigsQuery } from "@/src/features/public/gigs/types";

export const useGigs = (params?: GetGigsQuery) => {
  const swr = useSWR(["public-gigs", params], () => getGigs(params));

  return {
    ...swr,
    gigs: swr.data?.data ?? [],
    meta: swr.data?.meta,
    isLoading: swr.isLoading,
  };
};
