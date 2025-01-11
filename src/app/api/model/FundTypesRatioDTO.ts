import {AgentDTO} from './AgentDTO';
import {AgentPlanDTO} from './AgentPlanDTO';
import {BankAccountInFundPlanDraftDTO} from './BankAccountInFundPlanDraftDTO';
import {FundPlanDTO} from './FundPlanDTO';
import {UserFundPlanDraftDTO} from './UserFundPlanDraftDTO';
import {FundPlanDraftFundDTO} from './FundPlanDraftFundDTO';

export interface FundTypesRatioDTO {
  commodities: number;
  equity: number;
  fixed: number;
  miscellaneous: number;
  mixed: number;
  moneyMarket: number;
  others: number;
  property: number;
}

