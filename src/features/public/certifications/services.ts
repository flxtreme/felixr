import type { PaginatedResponse } from "@/src/common/types";
import type { Certification, GetCertificationsQuery } from "@/src/features/public/certifications/types";
import { fetcher } from "@/src/utils/fetcher";

const API_PREFIX = "/public/certification";

const buildQuery = (params?: GetCertificationsQuery) => {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.offset !== undefined) searchParams.set("offset", String(params.offset));
  if (params.search !== undefined) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const getCertifications = (params?: GetCertificationsQuery) =>
  fetcher<PaginatedResponse<Certification>>(`${API_PREFIX}${buildQuery(params)}`);
