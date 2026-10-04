export type Stack = {
  id: string;
  label: string;
  key: string;
  color: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type GetStacksQuery = {
  limit?: number;
  offset?: number;
  search?: string;
};
