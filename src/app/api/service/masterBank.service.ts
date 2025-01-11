import {Injectable} from '@angular/core';
import {
  AccountDTO, BankAccountDTO, BankBranchDTO, BankDTO, DropdownDTO,
  ListResponseAccountATSDTO,
} from '@model';
import {PnApiClientService} from '@postnerd-core';
import {Observable} from 'rxjs';
import {apiBaseUrl} from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class MasterBankService {

  constructor(protected api: PnApiClientService) {
  }

  public dropdownBankGet$(): Observable<Array<BankDTO>> {
    return this.api.get(`${apiBaseUrl()}/master/banks`, undefined);
  }

  public dropdownBankBranchGet$(bankCode?: string): Observable<Array<BankBranchDTO>> {
    return this.api.get(`${apiBaseUrl()}/master/banks/branches`, {bankCode});
  }

}
