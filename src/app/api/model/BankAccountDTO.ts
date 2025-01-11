import { BankSubscriptionDTO } from './BankSubscriptionDTO';
import { BankRedemptionDTO } from './BankRedemptionDTO';

export interface BankAccountDTO {
  bankSubscription: BankSubscriptionDTO;
  bankRedemption: BankRedemptionDTO;
}
