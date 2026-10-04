export type Training = {
  id: string;
  title: string;
  provider: string;
  completedAt: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type GetTrainingsQuery = {
  limit?: number;
  offset?: number;
  search?: string;
};
