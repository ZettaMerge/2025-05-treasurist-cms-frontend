import {AgentDTO} from './AgentDTO';
import {AgentPlanDTO} from './AgentPlanDTO';
import {BankAccountInFundPlanDraftDTO} from './BankAccountInFundPlanDraftDTO';
import {FundPlanDTO} from './FundPlanDTO';
import {UserFundPlanDraftDTO} from './UserFundPlanDraftDTO';
import {FundPlanDraftFundDTO} from './FundPlanDraftFundDTO';

export interface FundPlanDraftFundSummaryDTO {
  acceptFxRiskFlag: boolean;
  acceptRiskProfileFlag: boolean;
  acceptVulnerableFlag: boolean;
  amcCode: string;
  counterAmcCode: string;
  counterFundCode: string;
  counterFundRiskLevel: string;
  dcaSaOrderNoView: string;
  dcaTransactionRemark: string;
  fundCode: string;
  fundRiskLevel: string;
  fundType: string;
  fxRiskFlag: boolean;
  id: number;
  isCompleteDcaTransaction: boolean;
  isCompleteTransaction: boolean;
  isSellAllUnit: boolean;
  plain: string;
  recurringCost: number;
  recurringCostPercentage: number;
  saOrderNoView: string;
  startingCost: number;
  startingCostPercentage: number;
  taxType: string;
  transactionRemark: string;
  unit: number;
}

