import type { PaginatedResponse } from "@/src/common/types";
import { fetcher } from "@/src/utils/fetcher";
import type { GetStacksQuery, Stack } from "@/src/features/public/stack/types";

const API_PREFIX = "/public/stack";

const buildQuery = (params?: GetStacksQuery) => {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.offset !== undefined) searchParams.set("offset", String(params.offset));
  if (params.search !== undefined) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const getStacks = (params?: GetStacksQuery) =>
  fetcher<PaginatedResponse<Stack>>(`${API_PREFIX}${buildQuery(params)}`);
