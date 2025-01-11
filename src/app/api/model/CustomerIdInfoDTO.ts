
export interface CustomerIdInfoDTO {
  accountId: number;
  fundPlans: FundPlanListDTO[];
  userId: number;
}

export interface FundPlanListDTO {
  fcnAccountId: string;
  id: number;
  name: string;
}
