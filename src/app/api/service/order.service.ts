import { Injectable } from '@angular/core';
import {
  ListResponseContentDTO,
  ListResponseOrderTransactionsDetailDTO,
  ListResponseOrderTransactionsDTO,
  OrderTransactionListDTO,
  OrderTransactionVulnerableListDTO,
  RecurringSubscriptionsDTO,
  RedemptionDTO,
  SubscriptionDTO,
  SwitchingsDTO
} from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(protected api: PnApiClientService) { }

  public orderTransactionListGet$(amcCode?: string, columnName?: string, direction?: string, endEffectiveDate?: string, fundCode?: string, keyword?: string, limit?: number, page?: number, paymentType?: string, startEffectiveDate?: string, status?: string, transactionDateTime?: string, transactionType?: string, vulnerableFlag?: boolean, statuses?: Array<string>): Observable<ListResponseOrderTransactionsDTO<OrderTransactionListDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/order-transactions`, { amcCode, columnName, direction, endEffectiveDate, fundCode, keyword, limit, page, paymentType, startEffectiveDate, status, transactionDateTime, transactionType, vulnerableFlag, statuses });
  }
  public orderTransactionIdGet$(saOrderNoView: string): Observable<ListResponseOrderTransactionsDetailDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/order-transactions/sa_order_no_view/${encodeURIComponent(String(saOrderNoView))}`, undefined);
  }

  public dropdownStatusGet$(): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/manage/order-transactions/dropdown/status`);
  }

  public dropdownPaymentTypeGet$(): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/manage/order-transactions/dropdown/payment_type`);
  }

  public dropdownTransactionTypeGet$(): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/manage/order-transactions/dropdown/transaction_type`);
  }
  public orderTransactionApprovePatch$(transactionId: number, orderType: string, body: OrderTransactionListDTO): Observable<OrderTransactionListDTO> {
    return this.api.patch(`${apiBaseUrl()}/manage/transaction/transaction-approve${encodeURIComponent(String(transactionId))}${encodeURIComponent(String(orderType))}`, body, undefined);
  }

  public orderTransactionVulnerableListGet$(authenticated?: boolean, authority?: string, date?: string, page?: number, size?: number): Observable<ListResponseContentDTO<OrderTransactionListDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/transaction/list-vulnerable`, { authenticated, authority, date, page, size });
  }

  public orderTransactionVulnerableApprovePatch$(saOrderNoView: string): Observable<any> {
    return this.api.patch(`${apiBaseUrl()}/manage/order-transactions/sa_order_no_view/${encodeURIComponent(String(saOrderNoView))}/approve`, undefined);
  }

  public orderTransactionExportReport$(amcCode: string, columnName: string, direction: string, endEffectiveDate: string, fundCode: string, keyword: string, paymentType: string, startEffectiveDate: string, status: string, transactionDateTime: string, transactionType: string, vulnerableFlag: boolean, statuses?: Array<string>): Observable<any> {
    return this.api.blobGet(`${apiBaseUrl()}/manage/order-transactions/excel-report`, { amcCode, columnName, direction, endEffectiveDate, fundCode, keyword, paymentType, startEffectiveDate, status, transactionDateTime, transactionType, vulnerableFlag, statuses }, undefined);
  }

  public orderTransactionSubscriptionPost$(body: SubscriptionDTO): Observable<SubscriptionDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/order-transactions/subscription`, body, undefined);
  }

  public orderTransactionRedemptionPost$(body: RedemptionDTO): Observable<RedemptionDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/order-transactions/redemption`, body, undefined);
  }

  public orderTransactionSwitchingPost$(body: SwitchingsDTO): Observable<SwitchingsDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/order-transactions/switching`, body, undefined);
  }

  public orderTransactionRecurringSubscriptionPost$(body: RecurringSubscriptionsDTO): Observable<RecurringSubscriptionsDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/order-transactions/recurringSubscription`, body, undefined);
  }
  public orderTransactionUploadFilePost$(file: Blob, userId: number): Observable<any> {
    console.log('REQUEST DATA:', file);
    const formData = new FormData();
    // tslint:disable-next-line: forin
    formData.append('file', file);
    console.log('FORM DATA:', formData);
    return this.api.post(`${apiBaseUrl()}/manage/order-transactions/upload-slip/${encodeURIComponent(String(userId))}`, formData, undefined);
  }
}
