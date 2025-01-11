import {AddressDTO} from './AddressDTO';
import {AgentPortfolioDTO} from './AgentPortfolioDTO';
import {BankDTO} from './BankDTO';
import {TeamDTO} from './TeamDTO';
import {UserInAgentDTO} from './UserInAgentDTO';


export interface AgentDTO {
  addresses: AddressDTO[];
  agentPortfolio: AgentPortfolioDTO;
  bank: BankDTO;
  bankAccountNo: string;
  birthdate: Date;
  commissionPercentage: number;
  icLicense: string;
  id: number;
  inactiveDate: Date;
  isTeamLeader: boolean;
  licenseExpireDate: Date;
  plainComplexFlag: string;
  team: TeamDTO;
  user: UserInAgentDTO;
  updatedDate: Date;
}



