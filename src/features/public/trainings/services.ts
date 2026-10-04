import type { PaginatedResponse } from "@/src/common/types";
import type { GetTrainingsQuery, Training } from "@/src/features/public/trainings/types";
import { fetcher } from "@/src/utils/fetcher";

const API_PREFIX = "/public/training";

const buildQuery = (params?: GetTrainingsQuery) => {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.offset !== undefined) searchParams.set("offset", String(params.offset));
  if (params.search !== undefined) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const getTrainings = (params?: GetTrainingsQuery) =>
  fetcher<PaginatedResponse<Training>>(`${API_PREFIX}${buildQuery(params)}`);
