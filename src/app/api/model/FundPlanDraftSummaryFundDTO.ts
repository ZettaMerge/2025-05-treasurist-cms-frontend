import {AgentDTO} from './AgentDTO';
import {AgentPlanDTO} from './AgentPlanDTO';
import {BankAccountInFundPlanDraftDTO} from './BankAccountInFundPlanDraftDTO';
import {FundPlanDTO} from './FundPlanDTO';
import {UserFundPlanDraftDTO} from './UserFundPlanDraftDTO';
import {ExpectedReturnDTO} from './ExpectedReturnDTO';
import {FundPlanDraftFundSummaryDTO} from './FundPlanDraftFundSummaryDTO';
import {FundTypesRatioDTO} from './FundTypesRatioDTO';

export interface FundPlanDraftSummaryFundDTO {
  agent: AgentDTO;
  agentPlan: AgentPlanDTO;
  agentRemark: string;
  bankAccount: BankAccountInFundPlanDraftDTO;
  confirmationDate: Date;
  confirmationSentDate: Date;
  createdDate: Date;
  draftType: string;
  expectedReturn: ExpectedReturnDTO;
  frequency: string;
  fundPlan: FundPlanDTO;
  fundPlanDraftFundSummaries: FundPlanDraftFundSummaryDTO[];
  fundTypesRatio: FundTypesRatioDTO;
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
}

