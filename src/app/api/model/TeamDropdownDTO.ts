import {AgentDTO} from './AgentDTO';

export interface TeamDropdownDTO {
  agents: AgentDTO[];
  createdBy: string;
  createdDate: Date;
  deletedBy: string;
  deletedDate: Date;
  id: number;
  name: string;
  updatedBy: string;
  updatedDate: Date;
}

