import { Product, ProductVariant } from '@prisma/client';

export interface IProductWithVariant extends Product {
  userId: string;
  productVariant: ProductVariant[];
}

export interface BaseParams {
  userId: string;
  page: number;
  limit: number;
  search?: string;
  from?: string;
  to?: string;
}
