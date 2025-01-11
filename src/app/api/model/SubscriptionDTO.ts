import { FundDTO, FundPlanDTO, RedemptionListDTO, SubscriptionListDTO, UserDTO } from '@model';
export interface SubscriptionDTO {
  fundPlan: FundPlanDTO;
  slipPath: string;
  subscriptions: SubscriptionListDTO[];
  user: UserDTO;
}
