export interface BaseParams {
  userId?: string;
  page: number;
  limit: number;
  search?: string;
  from?: string;
  to?: string;
}

export interface ProductResponse {
  data: any[]; // Match với repeated Product trong proto
  total: number;
  page: number;
  limit: number;
}
