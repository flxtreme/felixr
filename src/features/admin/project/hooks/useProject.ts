import useSWR from "swr";

import { getProjectById } from "@/src/features/admin/project/services";

const useProject = (id?: string) => {
  const swr = useSWR(id ? ["project", id] : null, () => getProjectById(id as string));

  return {
    ...swr,
    project: swr.data,
    isLoading: swr.isLoading,
  };
};

export default useProject;