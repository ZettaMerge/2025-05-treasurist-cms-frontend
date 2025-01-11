import { Injectable } from '@angular/core';
import {
  ListResponseUserCheckListDTO,
  UserCheckListsDTO,
  UserCheckListDTO
} from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class UserChecklistService {

  constructor(protected api: PnApiClientService) { }

  public userCheckListGet$(checkListType?: string, code?: string,  firstName?: string, identityNo?: string, lastName?: string, order?: string, page?: number, size?: number, sort?: string, type?: string, search?: string, isActive?: boolean ): Observable<ListResponseUserCheckListDTO<UserCheckListsDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/checkList`, { checkListType, code,  firstName, identityNo, lastName, order, page, size, sort, type, search, isActive});
  }

  public userCheckListPost$(body: UserCheckListDTO): Observable<UserCheckListDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/checkList/create`, body, undefined);
  }

  public userCheckListIdGet$(id: number): Observable<UserCheckListsDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/checkList/get/${encodeURIComponent(String(id))}`, undefined);
  }

  public userCheckListIdPut$(id: number, body: UserCheckListDTO): Observable<UserCheckListDTO> {
    return this.api.put(`${apiBaseUrl()}/manage/checkList/update/${encodeURIComponent(String(id))}`, body, undefined);
  }

  public userCheckListIdDelete$(id: number): Observable<any> {
    return this.api.delete(`${apiBaseUrl()}/manage/checkList/delete/${encodeURIComponent(String(id))}`, undefined);
  }
}
