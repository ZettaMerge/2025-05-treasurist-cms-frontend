import { Injectable } from '@angular/core';
import { ListResponseCustomerDTO, ListResponseRoleDTO, PermissionDTO, RoleDTO } from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(protected api: PnApiClientService) { }


  public roleListGet$(name: string, page: number, size: number): Observable<ListResponseRoleDTO<any>> {
    return this.api.get(`${apiBaseUrl()}/manage/roles`, { name, page, size });
  }

  public roleIdGet$(id: number): Observable<RoleDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/roles/${encodeURIComponent(String(id))}`, undefined);
  }

  public rolePost$(body: RoleDTO): Observable<RoleDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/roles`, body, undefined);
  }

  public roleUpdate$(body: RoleDTO, id: number): Observable<RoleDTO> {
    return this.api.put(`${apiBaseUrl()}/manage/roles/${encodeURIComponent(String(id))}`, body, undefined);
  }

  public permissionListGet$(): Observable<Array<PermissionDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/permissions/get-all`, undefined);
  }

}
