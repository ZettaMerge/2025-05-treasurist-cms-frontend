import {Injectable} from '@angular/core';
import {
  AgentDTO, AgentLicenseWithTeamDropdownTO,
  AssessmentSelectDTO,
  CustomNotiSelectedAllAgentDTO,
  FundPlanDraftDTO,
  ListResponseAgentDTO,
  ListResponseFundPlanDraftDTO,
  OpenAccountDTO
} from '@model';
import {PnApiClientService} from '@postnerd-core';
import {Observable} from 'rxjs';
import {apiBaseUrl} from '../api-base-url';
import {FundPlanDraftSummaryFundDTO} from "../model/FundPlanDraftSummaryFundDTO";

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(protected api: PnApiClientService) {
  }

  public agentListGet$(columnName?: string, direction?: string, search?: string, limit?: number, page?: number, teamId?: number, teamIds?: Array<number>): Observable<ListResponseAgentDTO<AgentDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/agents`, {columnName, direction, search, limit, page, teamId, teamIds});
  }

  public agentIdGet$(id: number): Observable<AgentDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/agents/${encodeURIComponent(String(id))}`, undefined);
  }

  public agentPost$(body: AgentDTO): Observable<AgentDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/agents`, body, undefined);
  }

  public agentPut$(id: number, body: AgentDTO): Observable<AgentDTO> {
    return this.api.put(`${apiBaseUrl()}/manage/agents/${encodeURIComponent(String(id))}`, body, undefined);
  }

  public agentDelete$(id: number): Observable<AgentDTO> {
    return this.api.delete(`${apiBaseUrl()}/manage/agents/${encodeURIComponent(String(id))}`, undefined);
  }

  public agentIcLicenseDropdownGet$(): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/manage/agents/dropdown/ic-license`, undefined);
  }

  public agentCustomNotiSelectedAllGet$(search?: string, teamId?: number, teamIds?: Array<number>): Observable<CustomNotiSelectedAllAgentDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/agents/custom-noti-selected-all-agent`, {search, teamId, teamIds});
  }

  // CUSTOMER SERVICE

  public customerFundPlanDraftListGet$(limit: number, page: number, columnName?: string, direction?: string, draftTypes?: Array<string>, endConfirmationDate?: string, icLicense?: string, search?: string, startConfirmationDate?: string, statuses?: Array<string>, isCompleteTransaction?: boolean): Observable<ListResponseFundPlanDraftDTO<FundPlanDraftDTO>> {
    return this.api.get(`${apiBaseUrl()}/fund-plan-draft`, {limit, page, columnName, direction, draftTypes, endConfirmationDate, icLicense, search, startConfirmationDate, statuses, isCompleteTransaction});
  }

  public customerFundPlanDraftByIdGet$(id: number): Observable<FundPlanDraftDTO> {
    return this.api.get(`${apiBaseUrl()}/fund-plan-draft/${encodeURIComponent(String(id))}`, undefined);
  }

  public customerFundPlanDraftSummaryByIdGet$(id: number): Observable<FundPlanDraftSummaryFundDTO> {
    return this.api.get(`${apiBaseUrl()}/fund-plan-draft/${encodeURIComponent(String(id))}/summary`, undefined);
  }

  public agentIcLicenseWithTeamDropdownGet$(): Observable<Array<AgentLicenseWithTeamDropdownTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/agents/dropdown`, undefined);
  }





}
