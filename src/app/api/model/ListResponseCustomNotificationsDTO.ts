import {Pagination} from './Pagination';

export interface ListResponseCustomNotificationsDTO<T> {
  customNotifications: T[];
  pagination: Pagination;
}



