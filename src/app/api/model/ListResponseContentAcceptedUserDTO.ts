
import { Pagination } from './Pagination';


export interface ListResponseContentAcceptedUserDTO<T> {
  contentAcceptedUsers: T[];
  pagination: Pagination;

}
