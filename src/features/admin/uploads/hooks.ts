import { mutate } from "swr";
import useSWR from "swr";
import { createAdminUpload, deleteAdminUpload, getAdminUploads, updateAdminUpload } from "@/src/features/admin/uploads/services";
import type { CreateAdminUploadPayload, UpdateAdminUploadPayload } from "@/src/features/admin/uploads/types";

export function useAdminUploads(params: { offset: number; limit: number; search?: string }) {
  const swr = useSWR(["admin-uploads", params], () => getAdminUploads(params));
  return { ...swr, uploads: swr.data?.data ?? [], meta: swr.data?.meta, isLoading: swr.isLoading };
}

export async function registerAdminUpload(payload: CreateAdminUploadPayload) {
  const upload = await createAdminUpload(payload);
  await mutate((key) => Array.isArray(key) && key[0] === "admin-uploads");
  return upload;
}

export async function editAdminUpload(id: string, payload: UpdateAdminUploadPayload) {
  const upload = await updateAdminUpload(id, payload);
  await mutate((key) => Array.isArray(key) && key[0] === "admin-uploads");
  return upload;
}

export async function removeAdminUpload(id: string) {
  const upload = await deleteAdminUpload(id);
  await mutate((key) => Array.isArray(key) && key[0] === "admin-uploads");
  return upload;
}
