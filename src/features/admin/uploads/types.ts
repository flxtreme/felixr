export interface AdminUpload {
  id: string;
  bucket: string;
  path: string;
  name: string;
  alt: string | null;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
  publicPath: string;
}

export interface AdminUploadResponse {
  data: AdminUpload[];
  meta: { total: number; offset: number; limit: number; page?: number };
}

export interface CreateAdminUploadPayload {
  file: File;
  name: string;
  alt?: string | null;
  metadata?: Record<string, string>;
}

export interface UpdateAdminUploadPayload {
  name?: string;
  alt?: string | null;
  metadata?: unknown | null;
}

export interface DeleteAdminUploadResponse {
  id: string;
  deleted: true;
}

export interface AdminUploadSignedUrl {
  url: string;
  expiresIn: number;
}
