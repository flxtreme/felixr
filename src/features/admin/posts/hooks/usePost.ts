import useSWR from 'swr';

import {
  getPostById,
} from '@/src/features/admin/posts/services';

const usePost = (id?: string) => {
  const swr = useSWR(
    id ? ['post', id] : null,
    () => getPostById(id as string),
  );

  return {
    ...swr,
    post: swr.data,
    isLoading: swr.isLoading,
  };
};

export default usePost;