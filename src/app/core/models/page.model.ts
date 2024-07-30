export interface PageResponse<T> {
  content: T[];
  size: number;
  totalElements: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  totalPages: number;
}
