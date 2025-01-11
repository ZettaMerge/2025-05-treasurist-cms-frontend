import { Pagination } from './Pagination';
import {DividendDTO} from './DividendDTO';

export interface ListResponseDividendDTO<T> {
  dividendReports: DividendDTO[];
  pagination: Pagination;

}
