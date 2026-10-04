import type { PaginatedResponse } from "@/src/common/types";
import { fetcher } from "@/src/utils/fetcher";
import type { GetGigsQuery, Gig } from "@/src/features/public/gigs/types";

const API_PREFIX = "/public/gig";

const buildQuery = (params?: GetGigsQuery) => {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.offset !== undefined) searchParams.set("offset", String(params.offset));
  if (params.search !== undefined) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const getGigs = (params?: GetGigsQuery) =>
  fetcher<PaginatedResponse<Gig>>(`${API_PREFIX}${buildQuery(params)}`);
