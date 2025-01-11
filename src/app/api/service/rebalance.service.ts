import {Injectable} from '@angular/core';
import {
  FundPlanReBalanceLogDTO, ListResponseRebalanceDTO,
} from '@model';
import {PnApiClientService} from '@postnerd-core';
import {Observable} from 'rxjs';
import {apiBaseUrl} from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class RebalanceService {

  constructor(protected api: PnApiClientService) {
  }

  public reBalanceLogListGet$(columnName: string, direction: string, endConfirmationDate: string, endSendDate: string, fundPlanId: number, icLicense: string, isCompleteTransaction: boolean, limit: number, page: number, reBalanceLogTypes: Array<string>, search: string, startConfirmationDate: string, startSendDate: string, statuses: Array<string>, userId: number): Observable<ListResponseRebalanceDTO<FundPlanReBalanceLogDTO>> {
    return this.api.get(`${apiBaseUrl()}/re-balance`, {
      columnName,
      direction,
      endConfirmationDate,
      endSendDate,
      fundPlanId,
      icLicense,
      isCompleteTransaction,
      limit,
      page,
      reBalanceLogTypes,
      search,
      startConfirmationDate,
      startSendDate,
      statuses,
      userId
    });
  }

  public reBalanceLogIdGet$(fundPlanReBalanceLogId: number): Observable<FundPlanReBalanceLogDTO> {
    return this.api.get(`${apiBaseUrl()}/re-balance/${encodeURIComponent(String(fundPlanReBalanceLogId))}`, undefined);
  }

}
