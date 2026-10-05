import { mutate } from "swr";
import { createAdminResource, deleteAdminResource, updateAdminResource } from "@/src/features/admin/resources/services";
import type { AdminResourceEndpoint } from "@/src/features/admin/resources/types";

export function useAdminResourceActions(endpoint: AdminResourceEndpoint) {
  const refresh = () => mutate((key) => Array.isArray(key) && (
    (key[0] === "admin" && key[1] === endpoint && key[2] === "list") ||
    (endpoint === "tag" && key[0] === "tags")
  ));

  const create = async (payload: Record<string, unknown>) => {
    const result = await createAdminResource(endpoint, payload);
    await refresh();
    return result;
  };

  const update = async (id: string, payload: Record<string, unknown>) => {
    const result = await updateAdminResource(endpoint, id, payload);
    await refresh();
    return result;
  };

  const remove = async (id: string, isPermanent = false) => {
    const result = await deleteAdminResource(endpoint, id, isPermanent);
    await refresh();
    return result;
  };

  return { create, update, remove };
}
