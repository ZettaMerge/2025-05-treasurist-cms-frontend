import { Pagination } from '@model';


export interface ListResponseUserDTO<T> {
  users: T[];
  pagination: Pagination;
}
