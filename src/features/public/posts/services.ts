import { fetcher } from '@/src/utils/fetcher';
import {
  GetPostsQuery,
  Post,
} from '@/src/features/public/posts/types';
import {
    PaginatedResponse,
} from '@/src/common/types';

const API_PREFIX = '/public/post';

const buildQuery = (params?: GetPostsQuery) => {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  if (params.offset !== undefined) {
    searchParams.append('offset', String(params.offset));
  }

  if (params.limit !== undefined) {
    searchParams.append('limit', String(params.limit));
  }

  if (params.status !== undefined) {
    searchParams.append('status', String(params.status));
  }

  if (params.postType !== undefined) {
    searchParams.append('postType', String(params.postType));
  }

  if (params.isActive !== undefined) {
    searchParams.append('isActive', String(params.isActive));
  }

  if (params.search !== undefined) {
    searchParams.append('search', String(params.search));
  }

  if (params.tags !== undefined) {
    for( const tag of params.tags) {
      searchParams.append('tags', tag);
    }
  }

  return `?${searchParams.toString()}`;
};

export const getPosts = async (
  params?: GetPostsQuery,
): Promise<PaginatedResponse<Post>> => {
  return fetcher(`${API_PREFIX}${buildQuery(params)}`);
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  return fetcher(`${API_PREFIX}/slug/${slug}`);
};