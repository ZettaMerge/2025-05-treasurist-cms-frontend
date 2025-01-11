import {FundPlanDTO} from './FundPlanDTO';

export interface CustomerPortfolioDTO {
  fundPlans: FundPlanDTO[];
  isOpenAccount: boolean;
  totalCost: number;
  totalPortValue: number;
  totalProfit: number;
  totalProfitPercent: number;
}
