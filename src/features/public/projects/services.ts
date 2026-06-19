import { fetcher } from "@/src/utils/fetcher";
import { GetProjectsQuery, Project } from "@/src/features/public/projects/types";
import { PaginatedResponse } from "@/src/common/types";

const API_PREFIX = "/public/project";

const buildQuery = (params?: GetProjectsQuery) => {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.offset !== undefined) {
    searchParams.append("offset", String(params.offset));
  }

  if (params.limit !== undefined) {
    searchParams.append("limit", String(params.limit));
  }

  if (params.search !== undefined) {
    searchParams.append("search", String(params.search));
  }

  return `?${searchParams.toString()}`;
};

export const getProjects = async (params?: GetProjectsQuery): Promise<PaginatedResponse<Project>> => {
  return fetcher(`${API_PREFIX}${buildQuery(params)}`);
};

export const getProjectBySlug = async (slug: string): Promise<Project> => {
  return fetcher(`${API_PREFIX}/${slug}`);
};
