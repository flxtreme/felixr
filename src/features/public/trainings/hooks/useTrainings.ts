import useSWR from "swr";
import { getTrainings } from "@/src/features/public/trainings/services";
import type { GetTrainingsQuery } from "@/src/features/public/trainings/types";

const useTrainings = (params?: GetTrainingsQuery) => {
  const swr = useSWR(["public-trainings", params], () => getTrainings(params));

  return {
    ...swr,
    trainings: swr.data?.data ?? [],
    meta: swr.data?.meta,
    isLoading: swr.isLoading,
  };
};

export default useTrainings;
