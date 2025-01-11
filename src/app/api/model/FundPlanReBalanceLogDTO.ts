import { FundDTO } from './FundDTO';
import {AgentDTO} from './AgentDTO';
import {FundPlanDTO} from './FundPlanDTO';
import {UserFundPlanDraftDTO} from './UserFundPlanDraftDTO';
import {FundPlanReBalanceLogFundDTO} from './FundPlanReBalanceLogFundDTO';

export interface FundPlanReBalanceLogDTO {
  agent: AgentDTO;
  confirmationDate: Date;
  createdDate: string;
  expireDate: string;
  fundPlan: FundPlanDTO;
  id: number;
  isCompleteTransaction: boolean;
  planBalance: number;
  reBalanceDueDate: Date;
  reBalanceLogType: string;
  recurringCost: number;
  remark: string;
  status: string;
  user: UserFundPlanDraftDTO;
  fundPlanReBalanceLogFunds: FundPlanReBalanceLogFundDTO;
}
