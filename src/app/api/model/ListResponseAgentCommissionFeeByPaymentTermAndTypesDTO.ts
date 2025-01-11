import { Pagination } from './Pagination';
import {AgentCommissionFeeByPaymentTermAndTypesDTO} from './AgentCommissionFeeByPaymentTermAndTypesDTO';

export interface ListResponseAgentCommissionFeeByPaymentTermAndTypesDTO<T> {
  agentCommissionFeeByPaymentTermAndTypes: AgentCommissionFeeByPaymentTermAndTypesDTO[];
  pagination: Pagination;

}
