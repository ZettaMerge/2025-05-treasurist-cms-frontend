import { Injectable } from '@angular/core';
import {
  CustomerListDTO,
  ListResponseCustomerDTO,
  CustomerProfileDTO,
  CustomerPortfolioDTO,
  CustomerIdInfoDTO,
  UnitHolderDTO,
  UserBalanceDTO,
  ListResponseUserBalanceDTO,
  CustomNotiSelectedAllCusDTO
} from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(protected api: PnApiClientService) { }

  public customerListGet$(FXFlag?: number, accountType?: string, comMoFlag?: number, amcCode?: string, cddScore?: number, blackListFlag?: string, cddNo3?: string, dcaFlag?: string, fundCode?: string, page?: number, search?: string, size?: number, vulnerableFlag?: string, riskLevel?: number, icLicense?: string, teamId?: number, direction?: string, columnName?: string, planType?: string): Observable<ListResponseCustomerDTO<CustomerListDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/customer`, { FXFlag, accountType, comMoFlag, amcCode, cddScore, blackListFlag, cddNo3, dcaFlag, fundCode, page, search, size, vulnerableFlag, riskLevel, icLicense, teamId, direction, columnName, planType });
  }

  public customerIdGet$(id: number): Observable<CustomerProfileDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/customer/${encodeURIComponent(String(id))}`, undefined);
  }

  public customerIdInfoGet$(userId: number, planTypes?: Array<string>): Observable<CustomerIdInfoDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/customer/customer-id-info/${encodeURIComponent(String(userId))}`, {planTypes});
  }

  public customerPortfolioIdGet$(userId: number): Observable<CustomerPortfolioDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/customer/portfolio/${encodeURIComponent(String(userId))}`, undefined);
  }

  public customerUnitHolderGet$(fcnAccountId: string): Observable<UnitHolderDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/customer/unit-holder-by-fcn-account-id/${encodeURIComponent(String(fcnAccountId))}`, undefined);
  }

  public customerDropdownGet$(search?: string): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/manage/customer/dropdown`, { search });
  }


  public customerUserBalanceGet$(page: number, size: number, FXFlag?: number, accountTypes?: Array<string>, amcCodes?: Array<string>, cddScore?: number, columnName?: string, comMoFlag?: number, direction?: string, icLicenses?: Array<string>,  profitMax?: number, profitMin?: number, profitPercentMax?: number, profitPercentMin?: number, riskLevel?: number, search?: string, teamIds?: Array<number>, fundCodes?: Array<string>): Observable<ListResponseUserBalanceDTO<UserBalanceDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/customer/user-balances`, { page, size, FXFlag, accountTypes, amcCodes, cddScore, columnName, comMoFlag, direction, icLicenses, profitMax, profitMin, profitPercentMax, profitPercentMin, riskLevel, search, teamIds, fundCodes });
  }

  public customerSelectAllUserBalanceGet$(FXFlag?: number, accountTypes?: Array<string>, amcCodes?: Array<string>, cddScore?: number, comMoFlag?: number, icLicenses?: Array<string>,  profitMax?: number, profitMin?: number, profitPercentMax?: number, profitPercentMin?: number, riskLevel?: number, search?: string, teamIds?: Array<number>, fundCodes?: Array<string>): Observable<CustomNotiSelectedAllCusDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/customer/custom-noti-selected-all-user-balances`, {FXFlag, accountTypes, amcCodes, cddScore, comMoFlag, icLicenses, profitMax, profitMin, profitPercentMax, profitPercentMin, riskLevel, search, teamIds, fundCodes });
  }
  // public customerUserBalanceGet$(page: number, size: number, FXFlag ?: number, accountTypes?: Array<string>, amcCodes?: Array<string>, cddScore?: number, columnName?: string, comMoFlag?: number, direction?: string, icLicenses?: Array<string>,  profitMax?: number, profitMin?: number, profitPercentMax?: number, profitPercentMin?: number, riskLevel?: number, search?: string, teamIds?: Array<number>, fundCodes?: Array<string>): Observable<ListResponseUserBalanceDTO<UserBalanceDTO>> {
  //   return this.api.get(`${apiBaseUrl()}/manage/customer/user-balances`, { page, size, FXFlag , accountTypes, amcCodes, cddScore, columnName, comMoFlag, direction, icLicenses, profitMax, profitMin, profitPercentMax, profitPercentMin, riskLevel, search, teamIds, fundCodes });
  // }
  //
  // public customerSelectAllUserBalanceGet$(FXFlag ?: number, accountTypes?: Array<string>, amcCodes?: Array<string>, cddScore?: number, comMoFlag?: number, icLicenses?: Array<string>,  profitMax?: number, profitMin?: number, profitPercentMax?: number, profitPercentMin?: number, riskLevel?: number, search?: string, teamIds?: Array<number>, fundCodes?: Array<string>): Observable<CustomNotiSelectedAllCusDTO> {
  //   return this.api.get(`${apiBaseUrl()}/manage/customer/custom-noti-selected-all-user-balances`, {FXFlag , accountTypes, amcCodes, cddScore, comMoFlag, icLicenses, profitMax, profitMin, profitPercentMax, profitPercentMin, riskLevel, search, teamIds, fundCodes });
  // }

}
