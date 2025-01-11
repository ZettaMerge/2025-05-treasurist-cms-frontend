export interface CustomerPortOverviewDTO {
  commodities: number;
  cost: number;
  equity: number;
  fixedIncome: number;
  funds: Fund[];
  id: number;
  miscellaneous: number;
  mixed: number;
  moneyMarket: number;
  name: string;
  portValue: number;
  profit: number;
  profitPercent: number;
  property: number;
  fcnAccountId: string;
}

export interface Fund {
  acceptVulnerableFlag: boolean;
  amcCode: string;
  amount: number;
  availableUnit: number;
  availableVal: number;
  avgCost: number;
  buyPeriodFlag: string;
  convertLowBalUnit: number;
  convertLowBalVal: number;
  convertLowSellUnit: number;
  convertLowSellVal: number;
  cost: number;
  fundCode: string;
  fundHolidays: string[];
  fundPlanName: string;
  fundType: string;
  id: number;
  lowBalUnit: number;
  lowBalVal: number;
  lowSellUnit: number;
  lowSellVal: number;
  nav: number;
  navDate: Date;
  pendingAmount: number;
  pendingUnit: number;
  policy: string;
  preturn: number;
  profit: number;
  profitPercent: number;
  ratio: number;
  recSellDate: Date;
  remainAmount: number;
  remainUnit: number;
  riskLevel: string;
  sellCutOffTime: string;
  sellPeriodFlag: string;
  switchInPeriodFlag: string;
  switchOutPeriodFlag: string;
  taxType: string;
  thaiHolidays: string[];
  tradeCalendars: TradeCalendars;
  unit: number;
  unitholderId: string;
}

export interface TradeCalendars {
  redemption: string[];
  subscription: string[];
  switchingIn: string[];
  switchingOut: string[];
}
