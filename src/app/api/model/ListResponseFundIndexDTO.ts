import { FundIndexTypeDTO } from './FundIndexTypeDTO';
import { Pagination } from './Pagination';
import { Sort } from './Sort';

export interface ListResponseFundIndexDTO<T> {
  list: FundIndexTypeDTO[];
  page: number
  limit: number
  allPage: number
  allRecord: number
  itemCount: number

}
