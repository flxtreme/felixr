import { fetcher } from "@/src/utils/fetcher";
import type { AdminProduct, AdminProductListResponse, ProductPayload, ProductQuery } from "./types";
import { trackAdminMutation } from "@/src/lib/analytics/trackAdminMutation";

const API_PREFIX = "admin/product";

export const getAdminProducts = (params: ProductQuery) => {
  const query = new URLSearchParams({ offset: String(params.offset), limit: String(params.limit) });
  if (params.search) query.set("search", params.search);
  if (params.isDeleted !== undefined) query.set("isDeleted", String(params.isDeleted));
  return fetcher<AdminProductListResponse>(`${API_PREFIX}?${query.toString()}`);
};
export const getAdminProduct = (id: string) => fetcher<AdminProduct>(`${API_PREFIX}/${encodeURIComponent(id)}`);
export const createAdminProduct = async (payload: ProductPayload) => {
  return trackAdminMutation({ action: "insert", path: (product) => ["admin", "product", product.id], mutate: () => fetcher<AdminProduct>(API_PREFIX, { method: "POST", body: JSON.stringify(payload) }) });
};
export const updateAdminProduct = async (id: string, payload: Partial<ProductPayload>) => {
  return trackAdminMutation({ action: "update", path: ["admin", "product", id], getPrevious: () => getAdminProduct(id), mutate: () => fetcher<AdminProduct>(`${API_PREFIX}/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) }) });
};
export const deleteAdminProduct = async (id: string, isPermanent = false) => {
  return trackAdminMutation({ action: isPermanent ? "delete" : "soft_delete", path: ["admin", "product", id], getPrevious: () => getAdminProduct(id), mutate: () => fetcher<AdminProduct>(`${API_PREFIX}/${encodeURIComponent(id)}`, { method: "DELETE", body: JSON.stringify({ isPermanent }) }) });
};
