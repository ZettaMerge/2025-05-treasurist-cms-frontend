import { Pagination } from './Pagination';
import { Sort } from './Sort';

export interface ListResponseOrderTransactionsDTO<T> {
  orderTransactions: T[];
  pagination: Pagination;
}
