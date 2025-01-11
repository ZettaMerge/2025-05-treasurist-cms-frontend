import { Pagination } from './Pagination';
import { Sort } from './Sort';

export interface ListResponseUserCheckListDTO<T> {
  userCheckLists: T[];
  pagination: Pagination;

}
