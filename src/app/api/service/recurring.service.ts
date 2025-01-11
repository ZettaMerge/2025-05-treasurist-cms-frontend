import { Injectable } from '@angular/core';
import { RecurringDetailDTO } from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class RecurringService {

  constructor(protected api: PnApiClientService) {
  }

  public recurringListGet$(fcnAccountId?: string, fundplanId?: number, selectDate?: string, selectDay?: string): Observable<Array<RecurringDetailDTO>> {
    return this.api.get(`${apiBaseUrl()}/recurring-subscriptions/list`, { fcnAccountId, fundplanId, selectDate, selectDay}, undefined);
  }

}
