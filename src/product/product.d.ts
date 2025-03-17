import { Product, ProductVariant } from '@prisma/client';

export interface IProductWithVariant extends Product {
  productVariant: ProductVariant[];
}

export interface BaseParams {
  page: number;
  limit: number;
  search: string;
  from: string;
  to: string;
}
