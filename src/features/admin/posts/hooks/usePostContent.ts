import useSWR from 'swr';
import { getPostContentById } from '@/src/features/admin/posts/services';

const usePostContent = (id?: string) => {
  const swr = useSWR(
    id ? ['post-content', id] : null,
    () => getPostContentById(id as string),
  );

  return {
    ...swr,
    content: swr.data,
    isLoading: swr.isLoading,
  };
};

export default usePostContent;