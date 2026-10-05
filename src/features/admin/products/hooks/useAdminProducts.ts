import useSWR from "swr";
import { getAdminProduct, getAdminProducts } from "@/src/features/admin/products/services";
import type { ProductQuery } from "@/src/features/admin/products/types";

export function useAdminProducts(params: ProductQuery) {
  const swr = useSWR(["admin-products", params], () => getAdminProducts(params));
  return { ...swr, products: swr.data?.data ?? [], meta: swr.data?.meta, isLoading: swr.isLoading };
}
export function useAdminProduct(id: string) {
  const swr = useSWR(id ? ["admin-product", id] : null, () => getAdminProduct(id));
  return { ...swr, product: swr.data, isLoading: swr.isLoading };
}
