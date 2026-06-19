import { Post } from "@/src/features/public/posts/types";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  links: ProjectLink[];
  createdAt: string;
  updatedAt: string;
  page?: Post;
}

export interface GetProjectsQuery {
  offset?: number;
  limit?: number;
  search?: string;
}
