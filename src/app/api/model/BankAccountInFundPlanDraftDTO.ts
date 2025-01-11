import { BankSubscriptionDTO } from './BankSubscriptionDTO';
import { BankRedemptionDTO } from './BankRedemptionDTO';

export interface BankAccountInFundPlanDraftDTO {
  bankAccountNo: string;
  bankBranchCode: string;
  bankCode: string;
  bankEnName: string;
  bankShortName: string;
  bankThName: string;
  default: boolean;
  finnetCustomerNo: string;
  verified: boolean;
}
