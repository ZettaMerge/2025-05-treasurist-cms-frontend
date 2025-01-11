import { Injectable } from '@angular/core';
import {
  AccountDTO,
  BankAccountDTO,
  ListResponseAccountATSDTO,
  OpenAccountDTO,
  ContentDTO,
  AccountFileDTO,
  RejectAccountReasonDTO,
  RejectAccountReasonsResDTO,
} from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class RejectAccountReasonService {

  constructor(protected api: PnApiClientService) { }

  public rejectAccountReasonListGet$(accountId: number, page?: number, size?: number): Observable<RejectAccountReasonsResDTO<RejectAccountReasonDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/reject-account-reasons`, { accountId, page, size});
  }

  public rejectAccountReasonPost$(rejectAccountReason: RejectAccountReasonDTO): Observable<RejectAccountReasonDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/reject-account-reasons`, rejectAccountReason, undefined);
  }


}
