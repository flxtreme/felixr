import { fetcher } from "@/src/utils/fetcher";
import type { ProductListResponse } from "@/src/features/public/products/types";

const API_PREFIX = "/public/product";
const BATCH_SIZE = 100;

export const searchProducts = (search: string) => {
  const query = new URLSearchParams({ search, limit: "5" });
  return fetcher<ProductListResponse>(`${API_PREFIX}?${query.toString()}`);
};

const getProductsPage = (offset: number) =>
  fetcher<ProductListResponse>(`${API_PREFIX}?limit=${BATCH_SIZE}&offset=${offset}`);

export const getProducts = async () => {
  const firstPage = await getProductsPage(0);
  const pageSize = firstPage.meta.limit || BATCH_SIZE;
  const pages = await Promise.all(
    Array.from(
      {
        length: Math.ceil(
          Math.max(firstPage.meta.total - firstPage.data.length, 0) / pageSize,
        ),
      },
      (_, index) => getProductsPage((index + 1) * pageSize),
    ),
  );

  return [firstPage, ...pages].flatMap((response) => response.data);
};
