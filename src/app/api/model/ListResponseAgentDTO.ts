import { Pagination } from './Pagination';
import { AgentDTO } from './AgentDTO';

export interface ListResponseAgentDTO<T> {
  agents: AgentDTO[];
  pagination: Pagination;

}
