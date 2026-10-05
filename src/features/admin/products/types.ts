import type { Product, ProductActionType, ProductListResponse } from "@/src/features/public/products/types";

export type AdminProduct = Product & { isDeleted?: boolean; deletedAt?: string | null };
export type AdminProductListResponse = Omit<ProductListResponse, "data"> & { data: AdminProduct[] };
export type ProductPayload = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type ProductQuery = { offset: number; limit: number; search?: string; isDeleted?: boolean };
export type ProductFormValues = ProductPayload & { actionType: ProductActionType };
