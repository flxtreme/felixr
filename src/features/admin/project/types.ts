export interface GetProjectsQuery {
  offset: number;
  limit: number;
  search: string | null;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  pageId: string;
  links: ProjectLink[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  page: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    offset: number;
    limit: number;
  };
}

export interface Metadata {
}

export interface CreateProjectPayload {
  title: string;
  description: string | null;
  pageId: string;
  links: ProjectLink[];
  isDeleted: boolean;
}

export interface UpdateProjectPayload {
  title?: string | null;
  description?: string | null;
  pageId?: string | null;
  links?: ProjectLink[] | null;
  isDeleted?: boolean | null;
}

export interface DeleteProjectPayload {
  isPermanent: boolean;
}