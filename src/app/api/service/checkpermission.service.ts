import { Injectable } from '@angular/core';
import { PnApiClientService } from '@postnerd-core';
import {RolePermissionsDTO, UserRolePermissionsDTO} from '@model';
import {PermissionEnum} from '@app/core/variables/permission.enum';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionService {

  constructor(protected api: PnApiClientService) { }
  // userRolePermissions
  async checkIsAllow(userRolePermissions: UserRolePermissionsDTO, allowPermission: PermissionEnum): Promise<any> {
    // console.log('userRolePermissions', userRolePermissions);
    // console.log('allowPermission', allowPermission);
    let rolePerMission = {};
    if (userRolePermissions.rolePermissions) {
      userRolePermissions.rolePermissions.forEach(item => {
        if (item.permission.name === allowPermission) {
           rolePerMission = {canCreate: item.canCreate, canExport: item.canExport, canView: item.canView, permission: item.permission};
        }
      });

      return rolePerMission;
    }
  }

}
