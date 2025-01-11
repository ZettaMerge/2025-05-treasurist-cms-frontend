import { Injectable } from '@angular/core';
import {
  AccountDTO, BankAccountDTO,
  ListResponseContentDTO,
} from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class ManualService {

  constructor(protected api: PnApiClientService) { }

  public accountListGet$(dcaFlag?: string, endDate?: string, page?: number, size?: number, startDate?: string ): Observable<ListResponseContentDTO<AccountDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/account`, { dcaFlag, endDate, page, size, startDate });
  }

  public accountBankIdGet$(id: number): Observable<BankAccountDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/account/${encodeURIComponent(String(id))}`, undefined);
  }

}
