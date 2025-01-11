import { Pagination } from '@model';


export interface ListResponseRoleDTO<T> {
  roles: T[];
  pagination: Pagination;
}
