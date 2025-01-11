import { Pagination } from './Pagination';
import { Sort } from './Sort';

export interface ListResponseCustomnotiAgentHistoryDTO<T> {
  customNotiAgentHistories: T[];
  pagination: Pagination;

}
