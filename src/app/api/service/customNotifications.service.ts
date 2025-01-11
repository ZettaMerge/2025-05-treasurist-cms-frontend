import {Injectable} from '@angular/core';
import {
  AccountDTO,
  BankAccountDTO,
  ListResponseAccountATSDTO,
  OpenAccountDTO,
  ContentDTO,
  AccountFileDTO,
  CddScoreDTO,
  ListResponseCustomNotificationsDTO,
  CustomNotificationsDTO,
  UserBalanceDTO,
  ListResponseCustomnotiCusHistoryDTO,
  ListResponseCustomnotiAgentHistoryDTO, CustomNotiAgentHistory,
} from '@model';
import {PnApiClientService} from '@postnerd-core';
import {Observable} from 'rxjs';
import {apiBaseUrl} from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class CustomNotificationsService {

  constructor(protected api: PnApiClientService) {
  }

  public customNotificationListGet$(columnName?: string, direction?: string, endDate?: string, limit?: number, page?: number, startDate?: string, title?: string, type?: string ): Observable<ListResponseCustomNotificationsDTO<CustomNotificationsDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/custom-notifications`, {columnName, direction, endDate, limit, page, startDate, title, type });
  }

  public customNotificationsIdGet$(id: number): Observable<CustomNotificationsDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/custom-notifications/${encodeURIComponent(String(id))}`, undefined);
  }

  public customNotificationsPost$(dto: CustomNotificationsDTO): Observable<CustomNotificationsDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/custom-notifications`, dto, undefined);
  }

  public customNotificationsIdPut$(id: number, dto: CustomNotificationsDTO): Observable<CustomNotificationsDTO> {
    return this.api.put(`${apiBaseUrl()}/manage/custom-notifications/${encodeURIComponent(String(id))}`, dto);
  }

  public customNotificationsCustomerHistoryByIdGet$(columnName?: string, customNotiId?: number, direction?: string, limit?: number, page?: number): Observable<ListResponseCustomnotiCusHistoryDTO<UserBalanceDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/custom-noti-cus-histories`, {columnName, customNotiId, direction, limit, page});
  }

  public customNotificationsAgentHistoryByIdGet$(columnName?: string, customNotiId?: number, direction?: string, limit?: number, page?: number): Observable<ListResponseCustomnotiAgentHistoryDTO<CustomNotiAgentHistory>> {
    return this.api.get(`${apiBaseUrl()}/manage/custom-noti-agent-histories`, {columnName, customNotiId, direction, limit, page});
  }
}
