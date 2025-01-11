import { Pagination } from './Pagination';
import { Sort } from './Sort';

export interface ListResponseCustomerDTO<T> {
  customers: T[];
  pagination: Pagination;

}
