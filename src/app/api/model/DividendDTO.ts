export interface DividendDTO {
  amcCode: string;
  bankAccount: string;
  bankCode: string;
  bankName: string;
  bankShortName: string;
  bookClosedDate: Date;
  customerName: string;
  dividendAmount: number;
  dividendAmountNet: number;
  dividendRate: number;
  dvtId: number;
  fcnAccountId: string;
  fundCode: string;
  fundName: string;
  fundRiskLevel: string;
  paymentDate: Date;
  unit: number;
  withholdingTax: number;
}

