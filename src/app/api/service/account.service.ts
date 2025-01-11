import { Injectable } from '@angular/core';
import {
  AccountDTO, BankAccountDTO,
  ListResponseAccountATSDTO, OpenAccountDTO, ContentDTO, AccountFileDTO, CddScoreDTO,
} from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(protected api: PnApiClientService) {
  }

  public accountListGet$(accountStatuses?: Array<string>, accountType?: string, dcaFlag?: string, endDate?: string, page?: number, size?: number, startDate?: string, search?: string, columnName?: string, direction?: string): Observable<ListResponseAccountATSDTO<AccountDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/account`, {
      accountStatuses,
      accountType,
      dcaFlag,
      endDate,
      page,
      size,
      startDate,
      search,
      columnName,
      direction
    });
  }

  public accountBankIdGet$(id: number): Observable<BankAccountDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/account/${encodeURIComponent(String(id))}`, undefined);
  }

  public openAccountPost$(dto: OpenAccountDTO): Observable<OpenAccountDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/account/open-account`, dto, undefined);
  }

  public openAccountIdGet$(id: number): Observable<OpenAccountDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/account/open-account/${encodeURIComponent(String(id))}`, undefined);
  }

  public openAccountDetailIdGet$(id: number): Observable<OpenAccountDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/account/open-account-detail/${encodeURIComponent(String(id))}`, undefined);
  }

  public accountUploadFilePost$(userId: number, file: any, fileType?: string): Observable<any> {
    return this.api.multipartPost(`${apiBaseUrl()}/manage/account/upload-pdf/${encodeURIComponent(String(userId))}`, { file }, { fileType });
  }

  public accountFileGet$(userId: number, fileType?: string): Observable<AccountFileDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/account/account-file/${encodeURIComponent(String(userId))}`, { fileType });
  }

  public accountFileDelete$(accountFileId: number): Observable<any> {
    return this.api.delete(`${apiBaseUrl()}/manage/account/account-file/${encodeURIComponent(String(accountFileId))}`, undefined);
  }

  public accountUpdateCddScorePut$(accountId: number, body: CddScoreDTO): Observable<CddScoreDTO> {
    return this.api.put(`${apiBaseUrl()}/manage/account/update-cdd-score/${encodeURIComponent(String(accountId))}`, body, undefined);
  }

  public accountDownloadFileGet$(accountFileId: number): Observable<any> {
    return this.api.blobGet(`${apiBaseUrl()}/manage/account/download-pdf/${encodeURIComponent(String(accountFileId))}`, undefined);
  }

  public accountApprovePut$(accountId: number): Observable<any> {
    return this.api.put(`${apiBaseUrl()}/manage/account/open-account-approve/${encodeURIComponent(String(accountId))}`, undefined);
  }

  public accountResendRegisterEmailPut$(userId: number): Observable<any> {
    return this.api.put(`${apiBaseUrl()}/manage/account/resend-register-email/${encodeURIComponent(String(userId))}`, undefined);
  }

  public accountSyncBackAccountGet$(id: number): Observable<any> {
    return this.api.get(`${apiBaseUrl()}/manage/account/sync-back-account/${encodeURIComponent(String(id))}`);
  }

  public accountSyncBackAccountTransactionGet$(endEffectiveDate: string, id: string, startEffectiveDate: string): Observable<any> {
    return this.api.get(`${apiBaseUrl()}/manage/account/sync-back-account-transaction/${encodeURIComponent(String(id))}`, { endEffectiveDate, startEffectiveDate });
  }

  public accountSyncBackAccountByFCNXCodeGet$(fcnAccountId: string): Observable<any> {
    return this.api.get(`${apiBaseUrl()}/manage/account/account-by-fncx-code/${encodeURIComponent(String(fcnAccountId))}`);
  }

  //{fcnAccountId}

}
