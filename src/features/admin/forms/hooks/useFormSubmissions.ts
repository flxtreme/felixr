import useSWR from "swr";

import { getFormSubmissions } from "@/src/features/admin/forms/services";

import type { GetFormSubmissionsQuery } from "@/src/features/admin/forms/types";

export const useFormSubmissions = (params?: GetFormSubmissionsQuery) => {
  const key = ["form-submissions", params];

  const swr = useSWR(key, () => getFormSubmissions(params));

  return {
    ...swr,
    submissions: swr.data?.data ?? [],
    meta: swr.data?.meta,
    isLoading: swr.isLoading,
  };
};

export default useFormSubmissions;