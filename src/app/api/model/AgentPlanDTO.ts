
import {AgentDTO} from './AgentDTO';
import {AgentPlanFundDTO} from './AgentPlanFundDTO';


export interface AgentPlanDTO {
  agent: AgentDTO;
  agentPlanFunds: AgentPlanFundDTO[];
  createdDate: Date;
  id: number;
  name: string;
  recurringCost: number;
  startingCost: number;
  subscriptionPeriod: number;
  totalCost: number;
}



