import { FundDTO, FundPlanDTO, SwitchingsListDTO, UserDTO } from '@model';
export interface SwitchingsDTO {
  fundPlan: FundPlanDTO;
  switchings: SwitchingsListDTO[];
  user: UserDTO;
}
