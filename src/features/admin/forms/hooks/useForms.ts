import useSWR from "swr";

import { getForms } from "@/src/features/admin/forms/services";

import type { GetFormsQuery } from "@/src/features/admin/forms/types";

export const useForms = (params?: GetFormsQuery) => {
  const key = ["forms", params];

  const swr = useSWR(key, () => getForms(params));

  return {
    ...swr,
    forms: swr.data?.data ?? [],
    meta: swr.data?.meta,
    isLoading: swr.isLoading,
  };
};

export default useForms;