import { mutate } from "swr";
import { createAdminProduct, deleteAdminProduct, updateAdminProduct } from "@/src/features/admin/products/services";
import type { ProductPayload } from "@/src/features/admin/products/types";

const refresh = () => mutate((key) => Array.isArray(key) && (key[0] === "admin-products" || key[0] === "admin-product"));
export function useAdminProductActions() {
  return {
    create: async (payload: ProductPayload) => { const result = await createAdminProduct(payload); await refresh(); return result; },
    update: async (id: string, payload: Partial<ProductPayload>) => { const result = await updateAdminProduct(id, payload); await refresh(); return result; },
    remove: async (id: string, isPermanent = false) => { const result = await deleteAdminProduct(id, isPermanent); await refresh(); return result; },
  };
}
