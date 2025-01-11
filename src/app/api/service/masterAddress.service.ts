import {Injectable} from '@angular/core';
import {
  AccountDTO, BankAccountDTO, DropdownDTO,
  ListResponseAccountATSDTO,
} from '@model';
import {PnApiClientService} from '@postnerd-core';
import {Observable} from 'rxjs';
import {apiBaseUrl} from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class MasterAddressService {

  constructor(protected api: PnApiClientService) {
  }

  public dropdownProvinceGet$(): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/master/address/provinces`);
  }

  public dropdownDistrictGet$(province?: string): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/master/address/districts`, {province});
  }

  public dropdownSubDistrictGet$(district?: string, province?: string): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/master/address/sub-districts`, {district, province});
  }

  public dropdownPostalCodeGet$(district?: string, province?: string, subDistrict?: string): Observable<Array<any>> {
    return this.api.get(`${apiBaseUrl()}/master/address/postal-codes`, {district, province, subDistrict});
  }

}
