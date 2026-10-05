import { fetcher } from "@/src/utils/fetcher";
import type { AdminResourceEndpoint, AdminResourceQuery, AdminResourceRecord, AdminResourceResponse } from "./types";
import { trackAdminMutation } from "@/src/lib/analytics/trackAdminMutation";

const API_PREFIX = "admin";

const buildQuery = (params: AdminResourceQuery) => {
  const query = new URLSearchParams({ offset: String(params.offset), limit: String(params.limit) });
  if (params.search) query.set("search", params.search);
  if (params.isActive !== undefined) query.set("isActive", String(params.isActive));
  return `?${query.toString()}`;
};

export const getAdminResources = (endpoint: AdminResourceEndpoint, params: AdminResourceQuery) =>
  fetcher<AdminResourceResponse>(`${API_PREFIX}/${endpoint}${buildQuery(params)}`);

export const getAdminResourceById = (endpoint: AdminResourceEndpoint, id: string) =>
  fetcher<AdminResourceRecord>(`${API_PREFIX}/${endpoint}/${encodeURIComponent(id)}`);

export const createAdminResource = async (endpoint: AdminResourceEndpoint, payload: Record<string, unknown>) => {
  return trackAdminMutation({ action: "insert", path: (record) => ["admin", endpoint, record.id], mutate: () => fetcher<AdminResourceRecord>(`${API_PREFIX}/${endpoint}`, { method: "POST", body: JSON.stringify(payload) }) });
};

export const updateAdminResource = async (endpoint: AdminResourceEndpoint, id: string, payload: Record<string, unknown>) => {
  return trackAdminMutation({ action: "update", path: ["admin", endpoint, id], getPrevious: () => getAdminResourceById(endpoint, id), mutate: () => fetcher<AdminResourceRecord>(`${API_PREFIX}/${endpoint}/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) }) });
};

export const deleteAdminResource = async (endpoint: AdminResourceEndpoint, id: string, isPermanent = false) => {
  return trackAdminMutation({ action: isPermanent ? "delete" : "soft_delete", path: ["admin", endpoint, id], getPrevious: () => getAdminResourceById(endpoint, id), mutate: () => fetcher<AdminResourceRecord>(`${API_PREFIX}/${endpoint}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    body: JSON.stringify({ isPermanent }),
  }) });
};
