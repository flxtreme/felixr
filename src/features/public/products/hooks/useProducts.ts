import useSWR from "swr";
import { getProducts } from "@/src/features/public/products/services";

export const useProducts = () => {
  const swr = useSWR("public-products", getProducts);

  return {
    ...swr,
    products: swr.data ?? [],
    isLoading: swr.isLoading,
  };
};
