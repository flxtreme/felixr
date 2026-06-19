import useSWR from "swr";

import { getProjectBySlug } from "@/src/features/public/projects/services";

const useProjectBySlug = (slug?: string) => {
  const swr = useSWR(slug ? ["project-slug", slug] : null, () => getProjectBySlug(slug as string));

  return {
    ...swr,
    project: swr.data,
    isLoading: swr.isLoading,
  };
};

export default useProjectBySlug;
