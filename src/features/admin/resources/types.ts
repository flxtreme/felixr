export type AdminResourceEndpoint = "user" | "gig" | "experience" | "training" | "certification" | "stack" | "tag";

export interface AdminResourceRecord extends Record<string, unknown> {
  id: string;
  isDeleted?: boolean;
}

export interface AdminResourceQuery {
  offset: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}

export interface AdminResourceResponse {
  data: AdminResourceRecord[];
  meta: { total: number; offset: number; limit: number; page?: number };
}
