import useSWR from "swr";
import { getStacks } from "@/src/features/public/stack/services";
import type { GetStacksQuery } from "@/src/features/public/stack/types";

const EMPTY_STACKS = [];

const useStacks = (params?: GetStacksQuery) => {
  const swr = useSWR(["stacks", params], () => getStacks(params));

  return {
    ...swr,
    stacks: swr.data?.data ?? EMPTY_STACKS,
    meta: swr.data?.meta,
    isLoading: swr.isLoading,
  };
};

export default useStacks;
