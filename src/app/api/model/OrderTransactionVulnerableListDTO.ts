
export interface OrderTransactionVulnerableListDTO {
  amcCode: string;
  amount: number;
  effectiveDate: Date;
  email: string;
  enFirstname: string;
  enLastname: string;
  fcnAccountId: string;
  fundCode: string;
  navPrice: number;
  orderType: string;
  saOrderReferenceNo: string;
  status: string;
  thFirstname: string;
  thLastname: string;
  transactionDate: number;
  transactionId: string;
  unit: number;
  unitVal: number;
  vulnerableFlag: boolean;
}
