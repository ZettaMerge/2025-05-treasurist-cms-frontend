import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Inject, Injectable, Optional} from '@angular/core';
import {pnAuthGuardServiceConfigToken} from './pn-user-config.token';
import {PnAuthGuardServiceConfig, PnAuthServiceConfig} from './pn-auth.config';
import {PnStorageService} from '../storage/pn-storage.service';
import {PnAuthServiceBase} from './pn-auth.service.base';

@Injectable()
export class PnAuthGuard implements CanActivate {

  protected config: Required<PnAuthGuardServiceConfig> = {
    errorHandler: () => {

    },
  };
  constructor(
    @Optional() @Inject(pnAuthGuardServiceConfigToken) userConfig?: PnAuthGuardServiceConfig,
    // pnAuthServiceBase: PnAuthServiceBase,
    // private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const isAuth = this.pnAuthServiceBase.isLoggedIn();
    // console.log('isAuth', isAuth);
    // if (!isAuth) {
    //   this.router.navigate(['/auth/login']);
    // } else {
      return true;
    // }
  }
}
