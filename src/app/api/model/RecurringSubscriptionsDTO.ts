import { FundPlanDTO, RecurringSubscriptionsListDTO, UserDTO } from '@model';
export interface RecurringSubscriptionsDTO {
  fundPlan: FundPlanDTO;
  recurringSubscriptions: RecurringSubscriptionsListDTO[];
  user: UserDTO;
}
