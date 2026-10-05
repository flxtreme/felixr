import { fetcher } from "@/src/utils/fetcher";
import { trackAdminMutation, trackAdminMutationError } from "@/src/lib/analytics/trackAdminMutation";
import type { AdminUpload, AdminUploadResponse, AdminUploadSignedUrl, CreateAdminUploadPayload, DeleteAdminUploadResponse, UpdateAdminUploadPayload } from "./types";

const API_PREFIX = "admin/upload";

export function getAdminUploads(params: { offset: number; limit: number; search?: string }) {
  const query = new URLSearchParams({ offset: String(params.offset), limit: String(params.limit) });
  if (params.search) query.set("search", params.search);
  return fetcher<AdminUploadResponse>(`${API_PREFIX}?${query.toString()}`);
}

export function getAdminUpload(id: string) {
  return fetcher<AdminUpload>(`${API_PREFIX}/${encodeURIComponent(id)}`);
}

export function getAdminUploadSignedUrl(id: string, download = false) {
  const query = download ? "?download=true" : "";
  return fetcher<AdminUploadSignedUrl>(`${API_PREFIX}/${encodeURIComponent(id)}/signed-url${query}`);
}

export async function createAdminUpload(payload: CreateAdminUploadPayload) {
  const body = new FormData();
  body.append("file", payload.file, payload.name);
  if (payload.alt) body.append("alt", payload.alt);
  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    body.append("metadata", JSON.stringify(payload.metadata));
  }

  try {
    return await trackAdminMutation({
      action: "insert",
      path: (upload) => ["admin", "upload", upload.id],
      mutate: () => fetcher<AdminUpload>(`${API_PREFIX}`, { method: "POST", body }),
    });
  } catch (cause) {
    trackAdminMutationError(
      ["admin", "upload", payload.name],
      cause instanceof Error ? cause.message : "Upload failed",
    );
    throw cause;
  }
}

export function updateAdminUpload(id: string, payload: UpdateAdminUploadPayload) {
  return trackAdminMutation({
    action: "update",
    path: ["admin", "upload", id],
    getPrevious: () => getAdminUpload(id),
    mutate: () => fetcher<AdminUpload>(`${API_PREFIX}/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  });
}

export function deleteAdminUpload(id: string) {
  return trackAdminMutation({
    action: "delete",
    path: ["admin", "upload", id],
    getPrevious: () => getAdminUpload(id),
    mutate: () => fetcher<DeleteAdminUploadResponse>(`${API_PREFIX}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  });
}
