import {FundDTO} from './FundDTO';

export interface CustomerListDTO {
  accountId: number;
  accountStatus: string;
  bankApprove: boolean;
  bankConnect: boolean;
  birthdate: Date;
  canAcceptFxRisk: boolean;
  cardNumber: string;
  cddNo3: boolean;
  comMo: boolean;
  dcaFlag: boolean;
  email: string;
  enFirstname: string;
  enLastname: string;
  fcnAccountId: string;
  fundPlanId: number;
  funds: FundDTO[];
  iclicense: string;
  id: number;
  mobileNumber: string;
  portCost: number;
  portProfit: number;
  portProfitPercent: number;
  portValue: number;
  profileImageUrl: string;
  riskLevel: number;
  thFirstname: string;
  thLastname: string;
  vulnerableFlag: boolean;
  team: string;
  agentName: string;
}
