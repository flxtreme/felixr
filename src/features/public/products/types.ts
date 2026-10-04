export type ProductActionType = "redirect" | "download";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  link: string;
  actionType: ProductActionType;
  actionLabel: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  data: Product[];
  meta: {
    total: number;
    offset: number;
    limit: number;
    page: number;
  };
}
