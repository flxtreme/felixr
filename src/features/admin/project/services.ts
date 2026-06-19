import { fetcher } from "@/src/utils/fetcher";
import type {
  CreateProjectPayload,
  DeleteProjectPayload,
  GetProjectsQuery,
  PaginatedResponse,
  Project,
  UpdateProjectPayload,
} from "@/src/features/admin/project/types";

const API_PREFIX = "admin/project";

const buildQuery = (params?: GetProjectsQuery) => {
  if (!params) return "";
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) query.append(key, value.toString());
  }
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const getProjects = async (params?: GetProjectsQuery): Promise<PaginatedResponse<Project>> => {
  return fetcher(`${API_PREFIX}${buildQuery(params)}`);
};

export const getProjectById = async (id: string): Promise<Project> => {
  return fetcher(`${API_PREFIX}/${id}`);
};

export const createProject = async (payload: CreateProjectPayload): Promise<Project> => {
  return fetcher(API_PREFIX, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateProject = async (id: string, payload: UpdateProjectPayload): Promise<Project> => {
  return fetcher(`${API_PREFIX}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteProject = async (id: string, payload: DeleteProjectPayload): Promise<Project> => {
  return fetcher(`${API_PREFIX}/${id}`, {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
};