import { Pagination } from './Pagination';
import { Sort } from './Sort';

export interface ListResponseContentsDTO<C> {
  contents: C[];
  pagination: Pagination;

}
