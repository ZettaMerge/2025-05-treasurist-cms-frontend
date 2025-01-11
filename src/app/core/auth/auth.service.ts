import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpHandler, HttpParams, HttpRequest } from '@angular/common/http';
import { PnAuthServiceBase, WebHttpUrlEncodingCodec } from '@postnerd-core';

@Injectable()
export class AuthService extends PnAuthServiceBase {

  private isRefreshing = false;
  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log('handle401Error', this.isRefreshing);
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.requestRefreshToken$().subscribe((data) => {
        location.reload();
        return next.handle(this.addToken(request, data.accessToken));
      }, error => {
        this.router.navigate(['./auth/login']);
        return throwError(error);
      });
    } else {
      return next.handle(request);
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  requestTokenWithPasswordFlow$(username: string, password: string, rememberMe?: boolean, customQuery?: any): Observable<any> {
    if (!this.config.tokenUrl) {
      throw new Error('authApiUrl is needed to be set');
    }
    let body: any;
    const params = new HttpParams({ encoder: new WebHttpUrlEncodingCodec() });
    if (this.config.isFormData) {
      body = params
        .set(this.authRequestKey.username, username)
        .set(this.authRequestKey.password, password)
        .set(this.authRequestKey.subSystem, 'CMS');
    } else {
      body = {
        [this.authRequestKey.username]: username,
        [this.authRequestKey.password]: password,
        subSystem: 'CMS',
      };
    }
    console.log('requestTokenWithPasswordFlow');
    return this.requestToken(this.config.tokenUrl, body, customQuery);
  }

  handleWithJwt(response) {
    const [claims, claimsJson] = this.decodeIdToken(response.jwt);
    this.storage.setItem('claims_obj', claimsJson);
    // console.log('claims', claims);
    // console.log('claimsJson', claimsJson);
    response.expires_in = response.expires_in || claims.exp;
    return response.expires_in || claims.exp;
  }

  handleLonginSuccess(response) {
    this.storeAccessToken(response.jwt, response.jwt, response.expires_in, response.scope);
    this.setAdditionalAuthData(response);
    this.setAuthorize();
    this.storage.removeItem('permissions');
    this.storage.removeItem('property-permissions');
  }


  logout() {
    // this._firebaseAuth.signOut();
    // console.log('louout')
    super.logout();
    this.router.navigate(['./auth/login']);
  }

  isAuthenticated() {
    // return false;
    return true;
  }
}
