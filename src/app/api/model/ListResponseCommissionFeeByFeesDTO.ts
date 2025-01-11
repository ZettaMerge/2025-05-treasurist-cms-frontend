import { Pagination } from './Pagination';
import {AgentCommissionFeesListDTO} from './AgentCommissionFeesListDTO';

export interface ListResponseCommissionFeeByFeesDTO<T> {
  agentCommissionFees: AgentCommissionFeesListDTO[];
  pagination: Pagination;

}
