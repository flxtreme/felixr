import { fetcher } from '@/src/utils/fetcher';
import {
  CreatePostPayload,
  DeletePostPayload,
  GetPostsQuery,
  Post,
  UpdatePostPayload,
} from '@/src/features/admin/posts/types';
import {
    PaginatedResponse,
} from '@/src/common/types';
import { Metadata } from 'next';

const API_PREFIX = '/admin/post';

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

  if (params.tags !== undefined) {
    for( const tag of params.tags ) {
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

export const getPostById = async (id: string): Promise<Post> => {
  return fetcher(`${API_PREFIX}/${id}`);
};

export const getPostContentById = async (id: string): Promise<string> => {
  return fetcher(`${API_PREFIX}/${id}/content`);
};

export const getPostMetadataById = async (id: string): Promise<Metadata> => {
  return fetcher(`${API_PREFIX}/${id}/metadata`);
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  return fetcher(`${API_PREFIX}/slug/${slug}`);
};

export const createPost = async (
  payload: CreatePostPayload,
): Promise<Post> => {
  return fetcher(API_PREFIX, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updatePost = async (
  id: string,
  payload: UpdatePostPayload,
): Promise<Post> => {
  return fetcher(`${API_PREFIX}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const deletePost = async (
  id: string,
  payload: DeletePostPayload,
): Promise<Post> => {
  return fetcher(`${API_PREFIX}/${id}`, {
    method: 'DELETE',
    body: JSON.stringify(payload),
  });
};