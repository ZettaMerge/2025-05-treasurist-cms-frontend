
import { FundIndexTypeDTO } from './FundIndexTypeDTO';
import { Pagination } from './Pagination';
import { Sort } from './Sort';
import { IndexTypeDTO } from '@model';

export interface ListResponseFundIndexIndexTypeDTO<T> {
  indexTypes: IndexTypeDTO[];
  pagination: Pagination;

}
