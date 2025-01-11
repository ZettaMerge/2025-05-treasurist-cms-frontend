import { Injectable } from '@angular/core';
import { DividendDTO, ListResponseDividendDTO } from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';
import { FundByIdDTO } from '../model/FundByIdDTO';

@Injectable({
  providedIn: 'root'
})
export class DividendService {

  constructor(protected api: PnApiClientService) {
  }

  public dividendListGet$(page: number, size: number, amcCode?: string, columnName?: string, direction?: string, endBookClosedDate?: string,
                          endPaymentDate?: string, fcnAccountId?: string, fundCode?: string, icLicense?: string, search?: string, startBookClosedDate?: string, startPaymentDate?: string,  userId?: number): Observable<ListResponseDividendDTO<DividendDTO>> {
    return this.api.get(`${apiBaseUrl()}/dividend-transactions/dividend-report`, { page, size, amcCode, columnName, direction, endBookClosedDate, endPaymentDate, fcnAccountId, fundCode, icLicense, search, startBookClosedDate, startPaymentDate, userId});
  }

  public dividendExportReport$(amcCode: string, columnName: string, direction: string, endBookClosedDate: string, endPaymentDate?: string, fcnAccountId?: string, fundCode?: string, icLicense?: string, search?: string, startBookClosedDate?: string, startPaymentDate?: string,  userId?: number): Observable<any> {
    return this.api.blobGet(`${apiBaseUrl()}/dividend-transactions/excel-client-order-dividend-report`, { amcCode, columnName, direction, endBookClosedDate, endPaymentDate, fcnAccountId, fundCode, icLicense, search, startBookClosedDate, startPaymentDate, userId}, undefined);
  }

}
