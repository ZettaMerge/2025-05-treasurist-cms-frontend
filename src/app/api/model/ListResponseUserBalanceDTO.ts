import {Pagination, UserBalanceDTO} from '@model';
import { DocumentFileDTO } from './DocumentFileDTO';

export interface ListResponseUserBalanceDTO<T> {
  userBalances: UserBalanceDTO[];
  pagination: Pagination;

}
