import {AgentDTO} from './AgentDTO';
import {AgentPlanDTO} from './AgentPlanDTO';
import {BankAccountInFundPlanDraftDTO} from './BankAccountInFundPlanDraftDTO';
import {FundPlanDTO} from './FundPlanDTO';
import {UserFundPlanDraftDTO} from './UserFundPlanDraftDTO';
import {FundPlanDraftFundDTO} from './FundPlanDraftFundDTO';

export interface FundPlanDraftDTO {
  agent: AgentDTO;
  agentPlan: AgentPlanDTO;
  agentRemark: string;
  bankAccount: BankAccountInFundPlanDraftDTO;
  confirmationDate: Date;
  confirmationSentDate: Date;
  createdDate: Date;
  draftType: string;
  frequency: string;
  fundPlan: FundPlanDTO;
  fundPlanDraftFunds: FundPlanDraftFundDTO[];
  id: number;
  name: string;
  recurringCost: number;
  selectDate: number;
  selectDay: string;
  startingCost: number;
  status: string;
  subscriptionPeriod: number;
  totalCost: number;
  unit: number;
  user: UserFundPlanDraftDTO;
  isCompleteTransaction: boolean;
}

