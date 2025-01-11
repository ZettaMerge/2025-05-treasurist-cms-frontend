import { Pagination } from './Pagination';
import { Sort } from './Sort';

export interface ListResponseAccountATSDTO<T> {
  accounts: T[];
  pagination: Pagination;

}
