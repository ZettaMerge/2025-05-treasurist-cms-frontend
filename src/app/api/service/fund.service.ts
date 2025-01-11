import { Injectable } from '@angular/core';
import {
  AssetDropdownDTO, CustomerPortOverviewDTO, FundChangeNameDTO, FundDropdownDTO, FundListDTO, FundNavDTO, FundUpdateByIdDTO, ListResponseFundListDTO,
} from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';
import { FundByIdDTO } from '../model/FundByIdDTO';

@Injectable({
  providedIn: 'root'
})
export class FundService {

  constructor(protected api: PnApiClientService) {
  }

  public fundDropdownGet$(amcCode?: string, fcnAccountId?: string, isActive?: boolean): Observable<Array<FundDropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/funds/dropdown`, { amcCode, fcnAccountId, isActive });
  }

  public fundPlanByIdGet$(fundPlanId: number): Observable<CustomerPortOverviewDTO> {
    return this.api.get(`${apiBaseUrl()}/fundPlan/${encodeURIComponent(String(fundPlanId))}`, undefined);
  }

  public fundListGet$(
    aimcCatName?: string, amcCode?: string, authenticated?: boolean, dividendFlag?: string, enFundType?: string,
    fundCode?: string, fxRiskFlag?: string, page?: number, policy?: string, performance?: string,
    riskLevel?: number, search?: string, size?: number, sorting?: string, taxType?: string, columnName?: string): Observable<ListResponseFundListDTO<FundListDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/funds/`, { aimcCatName, amcCode, authenticated, dividendFlag, enFundType, fundCode, fxRiskFlag, page, policy, performance, riskLevel, search, size, sorting, taxType, columnName });
  }

  public fundByIdGet$(id: number, fundplanId: number): Observable<FundByIdDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/funds/${encodeURIComponent(String(id))}`, { fundplanId }, undefined);
  }

  public fundSyncGet$(type: string): Observable<any> {
    return this.api.get(`${apiBaseUrl()}/manage/funds/sync`, { type });
  }

  public fundUpdatePut$(id: number, body: FundUpdateByIdDTO): Observable<FundUpdateByIdDTO> {
    return this.api.put(`${apiBaseUrl()}/manage/funds/${encodeURIComponent(String(id))}`, body);
  }

  public fundLastManualSyncGet$(): Observable<any> {
    return this.api.get(`${apiBaseUrl()}/manage/funds/last-manual-sync`, undefined);
  }

  public fundSyncAlltotTransactionGet$(): Observable<any> {
    return this.api.get(`${apiBaseUrl()}/manage/funds/sync-allotted-transactions`, undefined);
  }

  public fundWithOutFundMappingDropdownGet$(amcCode?: string, fcnAccountId?: string, isActive?: boolean): Observable<Array<FundDropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/funds/dropdown-without-fund-mapping`, { amcCode, fcnAccountId, isActive });
  }

  public fundNavGet$(fundCode: string,): Observable<FundNavDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/funds/nav`, { fundCode });
  }

  public fundNavPut$(fundCode: string, dto: FundNavDTO): Observable<any> {
    return this.api.put(`${apiBaseUrl()}/manage/funds/nav/${encodeURIComponent(String(fundCode))}`, dto);
  }

  public fundChangeNameDropdownGet$(fundCode: string,): Observable<Array<FundDropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/funds/change-name/target/dropdown`, { fundCode });
  }
  
  public fundChangeNamePost$(dto: FundChangeNameDTO): Observable<any> {
    return this.api.post(`${apiBaseUrl()}/manage/funds/change-name`, dto);
  }

}
