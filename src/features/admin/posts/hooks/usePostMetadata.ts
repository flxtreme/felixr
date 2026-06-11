import useSWR from 'swr';
import { getPostMetadataById } from '@/src/features/admin/posts/services';

const usePostMetadata = (id?: string) => {
  const swr = useSWR(
    id ? ['post-metadata', id] : null,
    () => getPostMetadataById(id as string),
  );

  return {
    ...swr,
    metadata: swr.data,
    isLoading: swr.isLoading,
  };
};

export default usePostMetadata;