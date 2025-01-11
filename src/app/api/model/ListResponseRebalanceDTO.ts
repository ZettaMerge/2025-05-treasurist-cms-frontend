import { Pagination } from './Pagination';
import { Sort } from './Sort';
import {FundPlanDraftDTO} from './FundPlanDraftDTO';
import {FundPlanReBalanceLogDTO} from './FundPlanReBalanceLogDTO';

export interface ListResponseRebalanceDTO<T> {
  fundPlanReBalanceLogDTOS: FundPlanReBalanceLogDTO[];
  pagination: Pagination;

}
