import { Metadata } from "next";

export type PostStatus = "DRAFT" | "PUBLISHED" | "TRASHED";

export type PostType = "POST" | "PAGE";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: PostStatus;
  postType: PostType;
  publishedAt: string | null;
  featureImages: string[];
  userId: string;
  tags?: string[];
  isDeleted: boolean;
  deletedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  views?: number;
}

export interface GetPostsQuery {
  offset?: number;
  limit?: number;
  status?: PostStatus;
  postType?: PostType;
  tags?: string[];
  isActive?: boolean;
  search?: string;
}

export interface FelixrMetadata {
  tags: string[];
  seo: Metadata;
}
