export interface Tag {
  id: string;
  name: string;
  slug: string;
  count?: number;
  excludeFromPages: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetTagsQuery {
  excludeFromPages?: boolean;
  isActive?: boolean;
  offset?: number;
  limit?: number;
  search?: string;
}

export interface CreateTagPayload {
  name: string;
  slug: string;
  excludeFromPages?: boolean;
}

export interface UpdateTagPayload {
  name?: string;
  slug?: string;
  excludeFromPages?: boolean;
}

export interface DeleteTagPayload {
  isPermanent?: boolean;
}

export interface SearchTagsQuery {
  query: string;
}
