import { Pagination } from './Pagination';
import { Sort } from './Sort';

export interface ListResponseFundListDTO<T> {
  list: T[];
  allPage: number;
  allRecord: number;
  itemCount: number;
  limit: number;
  page: number;
  // pagination: Pagination;

}
