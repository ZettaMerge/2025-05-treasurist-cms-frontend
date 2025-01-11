import { Pagination } from './Pagination';
import { Sort } from './Sort';

export interface ListResponseCustomnotiCusHistoryDTO<T> {
  customNotiCusHistories: T[];
  pagination: Pagination;

}
