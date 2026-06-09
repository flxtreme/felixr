import useSWR, { mutate } from 'swr';

import {
  createPost,
  deletePost,
  updatePost,
} from '@/src/features/admin/posts/services';

import type {
  CreatePostPayload,
  DeletePostPayload,
  UpdatePostPayload,
} from '@/src/features/admin/posts/types';

const usePostActions = () => {
  const create = async (payload: CreatePostPayload) => {
    const response = await createPost(payload);

    mutate((key) => Array.isArray(key) && key[0] === 'posts');

    return response;
  };

  const update = async (
    id: string,
    payload: UpdatePostPayload,
  ) => {
    const response = await updatePost(id, payload);

    mutate(['post', id]);
    mutate((key) => Array.isArray(key) && key[0] === 'posts');

    return response;
  };

  const remove = async (
    id: string,
    payload: DeletePostPayload,
  ) => {
    const response = await deletePost(id, payload);

    mutate(['post', id]);
    mutate((key) => Array.isArray(key) && key[0] === 'posts');

    return response;
  };

  return {
    create,
    update,
    remove,
  };
};

export default usePostActions;