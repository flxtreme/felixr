export type PostStatus = "DRAFT" | "PUBLISHED" | "TRASHED";

export type PostType = "POST" | "PAGE";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content?: string;
  status: PostStatus;
  postType: PostType;
  publishedAt: string | null;
  featureImages: string[];
  metadata?: Record<string, unknown> | null;
  userId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetPostsQuery {
  offset?: number;
  limit?: number;
  status?: PostStatus;
  postType?: PostType;
  tags?: string[];
}

export interface CreatePostPayload {
  title: string;
  excerpt?: string;
  slug: string;
  content: string;
  status?: PostStatus;
  postType: PostType;
  publishedAt?: string | null;
  featureImages?: string[];
  metadata?: Record<string, unknown> | null;
}

export interface UpdatePostPayload {
  title?: string;
  excerpt?: string | null;
  slug?: string;
  content?: string;
  status?: PostStatus;
  postType?: PostType;
  publishedAt?: string | null;
  featureImages?: string[];
  metadata?: Record<string, unknown> | null;
  userId?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdBy?: string | null;
}

export interface DeletePostPayload {
  isPermanent?: boolean;
}
