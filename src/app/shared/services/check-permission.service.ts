import { Injectable } from '@angular/core';
import { PermissionEnum } from '@app/core/variables/permission.enum';
import { PnStorageService } from '@postnerd-core';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionService {

  constructor(
    // private meService: MeService,
    private pnStorageService: PnStorageService
  ) {
  }

  async checkIsAllow(allowPermission: PermissionEnum): Promise<boolean> {
    return true;

    // TODO IMPLEMENT AFTER REQUEST CHECK PERMISSION PER PAGE
    const permissionText = this.pnStorageService.getItem('permissions');
    const myPermissions = JSON.parse(permissionText);
    if (this.checkIncludePermission(myPermissions, allowPermission)) {
      return true;
    }
    return false;
  }


  private checkIncludePermission(permission, allowPermission) {
    if (permission != null) {
      const fillterResult = permission.filter(x => {
        return x.key === allowPermission;
      });
      if (fillterResult != null && fillterResult.length > 0) {
        return true;
      }
    }
    return false;
  }
}
