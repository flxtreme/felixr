import useSWR from "swr";
import { getExperience } from "@/src/features/public/experience/services";
import type { Experience, GetExperienceQuery } from "@/src/features/public/experience/types";

const EMPTY_EXPERIENCE: Experience[] = [];

export const useExperience = (params?: GetExperienceQuery) => {
  const swr = useSWR(["experience", params], () => getExperience(params));

  return {
    ...swr,
    experience: swr.data?.data ?? EMPTY_EXPERIENCE,
    meta: swr.data?.meta,
    isLoading: swr.isLoading,
  };
};
