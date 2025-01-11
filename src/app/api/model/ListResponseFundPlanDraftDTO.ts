import { Pagination } from './Pagination';
import { Sort } from './Sort';
import {FundPlanDraftDTO} from './FundPlanDraftDTO';

export interface ListResponseFundPlanDraftDTO<T> {
  fundPlanDrafts: FundPlanDraftDTO[];
  pagination: Pagination;

}
