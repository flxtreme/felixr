import useSWR from "swr";

import { getProjects } from "@/src/features/admin/project/services";

import type { GetProjectsQuery } from "@/src/features/admin/project/types";

const useProjects = (params?: GetProjectsQuery) => {
  const key = ["projects", params];

  const swr = useSWR(key, () => getProjects(params));

  return {
    ...swr,
    projects: swr.data?.data ?? [],
    meta: swr.data?.meta,
    isLoading: swr.isLoading,
  };
};

export default useProjects;