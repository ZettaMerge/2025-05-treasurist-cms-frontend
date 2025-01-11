import { Injectable } from '@angular/core';
import { ListResponseUserDTO, UserDTO } from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(protected api: PnApiClientService) { }


  public userRoleListGet$(page: number, roleId: number, search: string , size: number): Observable<ListResponseUserDTO<any>> {
    return this.api.get(`${apiBaseUrl()}/manage/users/users-in-role`, { page, roleId, search, size });
  }

  public userRoleIdGet$(id: number): Observable<UserDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/users/${encodeURIComponent(String(id))}`, undefined);
  }

  public userRolePost$(body: any): Observable<any> {
    return this.api.post(`${apiBaseUrl()}/manage/users/create-user-in-role`, body, undefined);
  }

  public userRoleUpdate$(body: UserDTO, id: number): Observable<UserDTO> {
    return this.api.put(`${apiBaseUrl()}/manage/users/${encodeURIComponent(String(id))}`, body, undefined);
  }

  public userRoleDelete$(id: number): Observable<UserDTO> {
    return this.api.delete(`${apiBaseUrl()}/manage/users/${encodeURIComponent(String(id))}`, undefined);
  }


}
