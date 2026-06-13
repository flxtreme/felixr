import { mutate } from "swr";
import { createTag, deleteTag, updateTag } from "@/src/features/admin/tags/services";

import type {
  CreateTagPayload,
  DeleteTagPayload,
  UpdateTagPayload,
} from "@/src/features/admin/tags/types";

export const useTagActions = () => {
  const create = async (payload: CreateTagPayload) => {
    const response = await createTag(payload);

    mutate((key) => Array.isArray(key) && key[0] === "tags");

    return response;
  };

  const update = async (id: string, payload: UpdateTagPayload) => {
    const response = await updateTag(id, payload);

    mutate(["tag", id]);

    mutate((key) => Array.isArray(key) && key[0] === "tags");

    return response;
  };

  const remove = async (id: string, payload: DeleteTagPayload) => {
    const response = await deleteTag(id, payload);

    mutate(["tag", id]);

    mutate((key) => Array.isArray(key) && key[0] === "tags");

    return response;
  };

  return {
    create,
    update,
    remove,
  };
};
