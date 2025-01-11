import { Pageable } from './Pageable';
import { Sort } from './Sort';

export interface ListResponseContentDTO<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: Sort;
  first: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  empty: boolean;


}
