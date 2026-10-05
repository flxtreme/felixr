import useSWR from "swr";
import { getAdminResources } from "@/src/features/admin/resources/services";
import type { AdminResourceEndpoint, AdminResourceQuery } from "@/src/features/admin/resources/types";

export function useAdminResources(endpoint: AdminResourceEndpoint, params: AdminResourceQuery) {
  const swr = useSWR(["admin", endpoint, "list", params], () => getAdminResources(endpoint, params));

  return {
    ...swr,
    records: swr.data?.data ?? [],
    total: swr.data?.meta?.total ?? 0,
    isLoading: swr.isLoading,
  };
}
