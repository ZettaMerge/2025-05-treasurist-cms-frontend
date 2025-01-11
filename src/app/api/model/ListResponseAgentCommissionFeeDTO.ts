import { Pagination } from './Pagination';
import { AgentDTO } from './AgentDTO';
import {AgentCommissionFeeDTO} from './AgentCommissionFeeDTO';

export interface ListResponseAgentCommissionFeeDTO<T> {
  agentCommissionFees: AgentCommissionFeeDTO[];
  pagination: Pagination;

}
