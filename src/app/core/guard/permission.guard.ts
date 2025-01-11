import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {PnStorageService} from '@postnerd-core';
// import {StorageService} from '../../../../projects/@base/src/storage/storage.service';
// import {MeService} from '@api';
import {CheckPermissionService} from '@api';
import {ToastrService} from 'ngx-toastr';
import {PermissionEnum} from "@app/core/variables/permission.enum";

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    protected pnStorageService: PnStorageService,
    private checkPermissionService: CheckPermissionService,
    private toastrService: ToastrService,
    private router: Router
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('route data', route.data);
    if (route.data.permissions != null) {
      // console.log('route data', route.data);
      let result;
      let haveResult = false;
      for (const permission of route.data.permissions) {
        // console.log('permission', permission);
        result = await this.checkPermissionService.checkIsAllow(jsonRole, permission);
        // console.log('result', result);
        if (result) {
          if (!result.canView && !result.canCreate && !result.canExport) {
            haveResult = false;
            this.toastrService.error('Permission is not allowed', 'Permission');
            this.router.navigate(['pages/error']);
          } else {
            haveResult = true;
            break;
          }

        }
      }

      if (!result) {
        haveResult = false;
        this.toastrService.error('Permission is not allowed', 'Permission');
        this.router.navigate(['pages/error']);
      }
      return haveResult;
    }

    // console.log('hello canactivate');
    return true;
  }
}
