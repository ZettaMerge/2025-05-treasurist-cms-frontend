import {SubscriptionBankAccountDTO} from './SubscriptionBankAccountDTO';
import {RedemptionBankAccountDTO} from './RedemptionBankAccountDTO';

export interface AccountDTO {
  accountStatus: string;
  accountType: string;
  applicationDate: Date;
  bankApprove: boolean;
  bankConnect: boolean;
  canAcceptFxRisk: boolean;
  canCommo: boolean;
  cardNumber: string;
  dcaFlag: boolean;
  email: string;
  enFirstname: string;
  enLastname: string;
  fcnAccountId: string;
  fundPlanId: number;
  icLicense: string;
  icTeam: string;
  id: number;
  mobileNumber: string;
  redemptionBankAccounts: RedemptionBankAccountDTO[];
  riskLevel: number;
  subscriptionBankAccounts: SubscriptionBankAccountDTO[];
  thFirstname: string;
  thLastname: string;
  updatedBy: string;
  userId: number;
  vulnerableFlag: boolean;
}

