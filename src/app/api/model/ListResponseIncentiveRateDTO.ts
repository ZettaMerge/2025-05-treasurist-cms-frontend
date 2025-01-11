import { Pagination } from '@model';


export interface ListResponseIncentiveRateDTO<T> {
  incentiveRates: T[];
  pagination: Pagination;
}
