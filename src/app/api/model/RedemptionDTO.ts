import { FundDTO, FundPlanDTO, RedemptionListDTO, UserDTO } from '@model';


export interface RedemptionDTO {
  fundPlan: FundPlanDTO;
  redemptions: RedemptionListDTO[];
  user: UserDTO;
}
