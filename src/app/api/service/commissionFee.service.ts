import {Injectable} from '@angular/core';
import {
  ListResponseIncentiveRateDTO,
  IncentiveRateDTO,
  PaymentTermDTO,
  ListResponsePaymentTermListDTO,
  ListResponseAgentCommissionFeeDTO,
  AgentCommissionFeeDTO,
  AgentCommissionFeeByPaymentTermAndTypesDTO,
  ListResponseAgentCommissionFeeByPaymentTermAndTypesDTO,
  AgentCommissionFeeSummaryDTO,
  AgentCommissionFeesListDTO,
  ListResponseCommissionFeeByFeesDTO
} from '@model';
import {PnApiClientService} from '@postnerd-core';
import {Observable} from 'rxjs';
import {apiBaseUrl} from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class CommissionFeeService {

  constructor(protected api: PnApiClientService) {
  }

  // INCENTIVE RATE
  public incentiveRatesGet$(page?: number, limit?: number, amcCode?: string , columnName?: string, direction?: string, fundCode?: string, status?: string): Observable<ListResponseIncentiveRateDTO<IncentiveRateDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/incentive-rates`, {page, limit, amcCode, columnName, direction, fundCode, status});
  }

  public incentiveRatesExportExcelGet$(amcCode?: string , columnName?: string, direction?: string, fundCode?: string, status?: string): Observable<any> {
    return this.api.blobGet(`${apiBaseUrl()}/manage/incentive-rates/export-excel`, {amcCode, columnName, direction, fundCode, status});
  }

  public incentiveRatesImportPost$(file: any): Observable<any> {
    return this.api.multipartPost(`${apiBaseUrl()}/manage/incentive-rates/import`, {file}, undefined);
  }

  // PAYMENT
  public paymentTermsGet$(page?: number, limit?: number, columnName?: string, direction?: string, paymentDate?: string, status?: string): Observable<ListResponsePaymentTermListDTO<PaymentTermDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/payment-terms`, {page, limit, columnName, direction, paymentDate, status});
  }

  public paymentTermsIdGet$(id: number): Observable<PaymentTermDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/payment-terms/${encodeURIComponent(String(id))}`, undefined);
  }

  public paymentTermsPost$(feFeeFile: any,  trFeeFile: any,  description?: string, feFeeFileName?: string, paymentDate?: string, proFeeFile?: any, proFeeFileName?: string, status?: string, trFeeFileName?: string ): Observable<PaymentTermDTO> {
    return this.api.multipartPost(`${apiBaseUrl()}/manage/payment-terms`, { feFeeFile, trFeeFile, description, feFeeFileName, paymentDate, proFeeFile, proFeeFileName, status, trFeeFileName});
  }

  public paymentTermsPut$(id: number, feFeeFile: any,  trFeeFile: any,  description?: string, feFeeFileName?: string, paymentDate?: string, proFeeFile?: any, proFeeFileName?: string, status?: string, trFeeFileName?: string ): Observable<PaymentTermDTO> {
    return this.api.multipartPut(`${apiBaseUrl()}/manage/payment-terms/${encodeURIComponent(String(id))}`,  { feFeeFile, trFeeFile, description, feFeeFileName, paymentDate, proFeeFile, proFeeFileName, status, trFeeFileName});
  }

  public paymentTermsUpdateStatusPut$(id: number,  description: string, paymentDate: string, status?: string, ): Observable<PaymentTermDTO> {
    return this.api.multipartPut(`${apiBaseUrl()}/manage/payment-terms/update-status/${encodeURIComponent(String(id))}`, {description, paymentDate, status} , undefined);
  }

  public paymentTermsExportExcelCommissionFeeGet$(id: number): Observable<any> {
    return this.api.blobGet(`${apiBaseUrl()}/manage/payment-terms/export-excel-commission-fee/${encodeURIComponent(String(id))}`, undefined, undefined);
  }

  public paymentTermsImportExcelCommissionFeePut$(id: number, file?: any): Observable<PaymentTermDTO> {
    return this.api.multipartPut(`${apiBaseUrl()}/manage/payment-terms/import-commission-fees/${encodeURIComponent(String(id))}`, {file}, undefined);
  }

  // AGENT FEE REPORT
  public agentCommissionFeeListGet$(page: number, size: number, columnName?: string, direction?: string, endPaymentDate?: string, search?: string, startPaymentDate?: string, teamId?: number): Observable<ListResponseAgentCommissionFeeDTO<AgentCommissionFeeDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/agents/commission-fee-report`, {page, size, columnName, direction, endPaymentDate, search, startPaymentDate, teamId});
  }

  public agentCommissionFeeByPaymentTermsAndTypeListGet$(id: number, page: number, size: number, columnName?: string, direction?: string, endPaymentDate?: string, search?: string, startPaymentDate?: string, teamId?: number): Observable<ListResponseAgentCommissionFeeByPaymentTermAndTypesDTO<AgentCommissionFeeByPaymentTermAndTypesDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/agents/commission-fee-report-by-payment-term-and-type/${encodeURIComponent(String(id))}`, {page, size, columnName, direction, endPaymentDate, search, startPaymentDate, teamId});
  }

  public agentCommissionFeeByPaymentTermsAndTypeDetailGet$(id: number, columnName?: string, direction?: string, endPaymentDate?: string, search?: string, startPaymentDate?: string, teamId?: number): Observable<AgentCommissionFeeSummaryDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/agents/commission-fee-report-summary-detail/${encodeURIComponent(String(id))}`, {columnName, direction, endPaymentDate, search, startPaymentDate, teamId});
  }

  public agentCommissionReportByFeeListGet$(icLicense: string, page: number , size: number, paymentTermId: number, type: string, columnName?: string, direction?: string): Observable<ListResponseCommissionFeeByFeesDTO<AgentCommissionFeesListDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/agents/commission-fee-report-by-fees`, {icLicense, page, size, paymentTermId, type, columnName, direction});
  }

  public agentCommissionPaymentTermsGet$(id: string): Observable<PaymentTermDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/payment-terms/${encodeURIComponent(String(id))}`, undefined);
  }


}
