import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { PnStorageService } from '@postnerd-core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private storage: PnStorageService,
    private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const accessToken = this.storage.getItem('access_token');
    console.log('accessToken', accessToken);
    if (!accessToken) {
      this.router.navigate(['/auth/login']);
    } else {
      return true;
    }
  }
}
