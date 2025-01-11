export interface FundPlanDraftFundDTO {
  amcCode: string;
  counterAmcCode: string;
  counterFundCode: string;
  dcaSaOrderNoView: string;
  dcaTransactionRemark: string;
  fundCode: string;
  id: number;
  isCompleteDcaTransaction: boolean;
  isCompleteTransaction: boolean;
  isSellAllUnit: boolean;
  recurringCost: number;
  saOrderNoView: string;
  startingCost: number;
  transactionRemark: string;
  unit: number;
}
