import type { PaginatedResponse } from "@/src/common/types";
import { fetcher } from "@/src/utils/fetcher";
import type { Experience, GetExperienceQuery } from "@/src/features/public/experience/types";

const API_PREFIX = "/public/experience";

const buildQuery = (params?: GetExperienceQuery) => {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.append("page", String(params.page));
  if (params.limit !== undefined) searchParams.append("limit", String(params.limit));
  if (params.offset !== undefined) searchParams.append("offset", String(params.offset));
  if (params.search !== undefined) searchParams.append("search", params.search);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const getExperience = (params?: GetExperienceQuery) =>
  fetcher<PaginatedResponse<Experience>>(`${API_PREFIX}${buildQuery(params)}`);

export const getExperienceById = (id: string) =>
  fetcher<Experience>(`${API_PREFIX}/${encodeURIComponent(id)}`);
