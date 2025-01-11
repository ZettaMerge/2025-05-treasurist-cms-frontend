export interface AuditRiskDTO {
  abilityAndWillingnessToTakeRisk: string;
  amcCode: string;
  amount: number;
  customerName: string;
  effectiveDate: Date;
  fcnAccountId: string;
  fundCode: string;
  fundRiskLevel: number;
  riskLevel: number;
  transactionDateTime: Date;
  transactionType: string;
  unit: number;
}

