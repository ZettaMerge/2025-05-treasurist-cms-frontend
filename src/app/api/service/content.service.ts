import { Injectable } from '@angular/core';
import {
  CustomerListDTO,
  ListResponseContentDTO,
  CustomerProfileDTO, ListResponseContentsDTO, ContentDTO, ListResponseContentAcceptedUserDTO, ContentAcceptedUser
} from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';
@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(protected api: PnApiClientService) { }

  public contentGetList$(columnName?: string, direction?: string, isActive?: boolean, size?: number, page?: number, type?: string, version?: number): Observable<ListResponseContentsDTO<ContentDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/contents`, { columnName, direction, isActive, size, page, type, version });
  }

  public contentGetById$(id: number): Observable<ContentDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/contents/${encodeURIComponent(String(id))}`, undefined);
  }

  public contentPut$(body: ContentDTO, id: number): Observable<ContentDTO> {
    return this.api.put(`${apiBaseUrl()}/manage/contents/${encodeURIComponent(String(id))}`, body, undefined);
  }

  public contentDelete$(id: number): Observable<any> {
    return this.api.delete(`${apiBaseUrl()}/manage/contents/${encodeURIComponent(String(id))}`, undefined);
  }

  public contentDropDownGet$(type?: string): Observable<Array<ContentDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/contents/get-all`, { type });
  }

  public contentsPost$(body: ContentDTO): Observable<ContentDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/contents`, body, undefined);
  }

  public contentActiveGet$(type: string): Observable<ContentDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/contents/get-active`, { type });
  }

  public contentAcceptedUsers$(columnName: string, contentType: string, contentVersion: number, direction: string, isContentActive: boolean, limit: number, nameOfUser: string, page: number): Observable<ListResponseContentAcceptedUserDTO<ContentAcceptedUser>> {
    return this.api.get(`${apiBaseUrl()}/manage/contents/accepted-users`, { columnName, contentType, contentVersion, direction, isContentActive, limit, nameOfUser, page });
  }

}
