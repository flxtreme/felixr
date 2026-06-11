import { fetcher } from '@/src/utils/fetcher';
import {
  GetPostsQuery,
  Post,
  FelixrMetadata as Metadata
} from '@/src/features/public/posts/types';
import {
    PaginatedResponse,
} from '@/src/common/types';

const API_PREFIX = '/public/post';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export const getPostContentBySlug = async (
  slug: string
): Promise<string> => {
  const res = await fetch(
    `${API_URL}/api/public/post/${slug}/content`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return "";
  }

  return res.text();
};

export const getPostMetadataBySlug = async (
  slug: string
): Promise<Metadata> => {
  const res = await fetch(
    `${API_URL}/api/public/post/${slug}/metadata`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return {
      tags: [],
      seo: {}
    };
  }

  return res.json();
};