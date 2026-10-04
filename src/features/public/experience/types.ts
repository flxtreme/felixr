export interface Experience {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  responsibilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetExperienceQuery {
  page?: number;
  limit?: number;
  offset?: number;
  search?: string;
}
