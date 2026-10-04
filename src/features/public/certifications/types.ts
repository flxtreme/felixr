export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  description: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type GetCertificationsQuery = {
  limit?: number;
  offset?: number;
  search?: string;
};
