import { fetcher } from '@/src/utils/fetcher';

import type {
  CreateTagPayload,
  DeleteTagPayload,
  GetTagsQuery,
  Tag,
  UpdateTagPayload,
} from '@/src/features/admin/tags/types';
import { PaginatedResponse } from '@/src/common/types';

const API_PREFIX = 'admin/tag';

const buildQuery = (params?: GetTagsQuery) => {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  if (params.excludeFromPages !== undefined) {
    searchParams.append(
      'excludeFromPages',
      String(params.excludeFromPages),
    );
  }

  if(params.isActive !== undefined) {
    searchParams.append('isActive', String(params.isActive));
  }

  if(params.search !== undefined) {
    searchParams.append('search', String(params.search));
  }

  if(params.offset !== undefined) {
    searchParams.append('offset', String(params.offset));
  }

  if(params.limit !== undefined) {
    searchParams.append('limit', String(params.limit));
  } 

  const query = searchParams.toString();

  return query ? `?${query}` : '';
};

export const getTags = async (
  params?: GetTagsQuery,
): Promise<PaginatedResponse<Tag>> => {
  return fetcher(`${API_PREFIX}${buildQuery(params)}`);
};

export const getTagById = async (
  id: string,
): Promise<Tag> => {
  return fetcher(`${API_PREFIX}/${id}`);
};

export const createTag = async (
  payload: CreateTagPayload,
): Promise<Tag> => {
  return fetcher(`${API_PREFIX}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateTag = async (
  id: string,
  payload: UpdateTagPayload,
): Promise<Tag> => {
  return fetcher(`${API_PREFIX}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const deleteTag = async (
  id: string,
  payload: DeleteTagPayload
): Promise<Tag> => {
  return fetcher(`${API_PREFIX}/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({}),
  });
};

export const searchTags = async (
  query: string,
): Promise<Tag[]> => {
  return fetcher(`${API_PREFIX}/search?query=${encodeURIComponent(query)}`);
};