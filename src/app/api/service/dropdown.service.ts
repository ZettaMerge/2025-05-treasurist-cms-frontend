import { Injectable } from '@angular/core';
import {
  AccountDTO, BankAccountDTO, DropdownDTO,
  ListResponseAccountATSDTO,
} from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(protected api: PnApiClientService) {
  }

  public dropdownAddressGet$(district?: string, postalCode?: string, province?: string): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/manage/address`, { district, postalCode, province });
  }

  public dropdownBusinessGet$(): Observable<Array<DropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/business/all`);
  }

  public dropdownCountryGet$(): Observable<Array<DropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/country/all`);
  }

  public dropdownMonthIncomeGet$(): Observable<Array<DropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/month-income/all`);
  }

  public dropdownNationalityGet$(): Observable<Array<DropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/nationality/all`);
  }

  public dropdownOccupationGet$(): Observable<Array<DropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/occupation/all`);
  }

  public dropdownFileCategoryGet$(): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/master/document-file-categories`);
  }

  public dropdownFileTypeGet$(categoryCode: number): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/master/document-file-types`, { categoryCode });
  }



}
