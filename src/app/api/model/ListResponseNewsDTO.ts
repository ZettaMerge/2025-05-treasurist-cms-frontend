import { Pagination } from './Pagination';

export interface ListResponseNewsDTO<T> {
  news: T[];
  pagination: Pagination;
}
