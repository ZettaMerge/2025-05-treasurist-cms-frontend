import {Injectable} from '@angular/core';
import {AuditRiskDTO, ListResponseAuditRiskListDTO} from '@model';
import {PnApiClientService} from '@postnerd-core';
import {Observable} from 'rxjs';
import {apiBaseUrl} from '../api-base-url';


@Injectable({
  providedIn: 'root'
})
export class AuditRiskService {

  constructor(protected api: PnApiClientService) {
  }

  public auditRiskListGet$(amcCode?: string, columnName?: string,
                           customerNameAndFcnAccountId?: string, direction?: string, endEffectiveDate?: string,
                           endTransactionDateTime?: string, fundCode?: string,
                           fundPlanId?: number, icLicense?: string, keyword?: string, limit?: number, page?: number,
                           paymentType?: string, reportMode?: string, startEffectiveDate?: string, startTransactionDateTime?: string, status?: string,
                           transactionDateTime?: string, transactionType?: string, userId?: number, vulnerableFlag?: boolean
  ): Observable<ListResponseAuditRiskListDTO<AuditRiskDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/audit-risks`, {
      amcCode,
      columnName,
      customerNameAndFcnAccountId,
      direction,
      endEffectiveDate,
      endTransactionDateTime,
      fundCode,
      fundPlanId,
      icLicense,
      keyword,
      limit,
      page,
      paymentType,
      reportMode,
      startEffectiveDate,
      startTransactionDateTime,
      status,
      transactionDateTime,
      transactionType,
      userId,
      vulnerableFlag,
    });
  }

  public auditRiskExportFileGet$(amcCode?: string, columnName?: string,
                                 customerNameAndFcnAccountId?: string, direction?: string, endEffectiveDate?: string,
                                 endTransactionDateTime?: string, fundCode?: string,
                                 fundPlanId?: number, icLicense?: string, keyword?: string,
                                 paymentType?: string, reportMode?: string, startEffectiveDate?: string, status?: string,
                                 transactionDateTime?: string, transactionType?: string, userId?: number, vulnerableFlag?: boolean, startTransactionDateTime?: string): Observable<any> {
    return this.api.blobGet(`${apiBaseUrl()}/manage/audit-risks/export-excel`, {
      amcCode,
      columnName,
      customerNameAndFcnAccountId,
      direction,
      endEffectiveDate,
      endTransactionDateTime,
      fundCode,
      fundPlanId,
      icLicense,
      keyword,
      paymentType,
      reportMode,
      startEffectiveDate,
      status,
      transactionDateTime,
      transactionType,
      userId,
      vulnerableFlag,
      startTransactionDateTime,
    });
  }


}
