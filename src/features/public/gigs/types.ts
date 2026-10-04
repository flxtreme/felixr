export interface Gig {
  id: string;
  title: string;
  description: string;
  details: string[];
  link: string;
  linkLabel: string;
  external: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetGigsQuery {
  limit?: number;
  offset?: number;
  search?: string;
}
