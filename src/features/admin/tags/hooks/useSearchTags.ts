import useSWR from 'swr';
import { searchTags } from '@/src/features/admin/tags/services';

export const useSearchTags = (query: string) => {
  const swr = useSWR(
    query ? ['searchTags', query] : null,
    () => searchTags(query),
  );

  return {
    ...swr,
    results: swr.data ?? [],
    isLoading: swr.isLoading,
  };
};
