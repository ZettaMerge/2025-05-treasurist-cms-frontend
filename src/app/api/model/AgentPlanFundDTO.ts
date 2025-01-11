import {AddressDTO} from './AddressDTO';
import {AgentPortfolioDTO} from './AgentPortfolioDTO';
import {BankDTO} from './BankDTO';
import {TeamDTO} from './TeamDTO';
import {UserInAgentDTO} from './UserInAgentDTO';


export interface AgentPlanFundDTO {
  amcCode: string;
  fundCode: string;
  id: number;
  recurringCost: number;
  startingCost: number;
}



