import { mutate } from "swr";

import { createProject, deleteProject, updateProject } from "@/src/features/admin/project/services";

import type {
  CreateProjectPayload,
  DeleteProjectPayload,
  UpdateProjectPayload,
} from "@/src/features/admin/project/types";

const useProjectActions = () => {
  const create = async (payload: CreateProjectPayload) => {
    const response = await createProject(payload);

    mutate((key) => Array.isArray(key) && key[0] === "projects");

    return response;
  };

  const update = async (id: string, payload: UpdateProjectPayload) => {
    const response = await updateProject(id, payload);

    mutate(["project", id]);
    mutate((key) => Array.isArray(key) && key[0] === "projects");

    return response;
  };

  const remove = async (id: string, payload: DeleteProjectPayload) => {
    const response = await deleteProject(id, payload);

    mutate(["project", id]);
    mutate((key) => Array.isArray(key) && key[0] === "projects");

    return response;
  };

  return {
    create,
    update,
    remove,
  };
};

export default useProjectActions;