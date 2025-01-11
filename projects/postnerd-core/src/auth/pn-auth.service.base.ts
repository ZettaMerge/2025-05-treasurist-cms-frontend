import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { PnStorageService } from '../storage/pn-storage.service';
import { PnAuthServiceInterface } from './pn-auth.service.interface';
import { PnAuthServiceConfig, PnAuthRequestKey, PnAuthResponseKey } from './pn-auth.config';
import { pnUserAuthInterceptorConfigToken, pnUserAuthRequestKeyToken, pnUserAuthResponseKeyToken, pnUserAuthServiceConfigToken } from './pn-user-config.token';
import { WebHttpUrlEncodingCodec } from './encoder';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class PnAuthServiceBase implements PnAuthServiceInterface {

  public can = {} as any;

  protected config: Required<PnAuthServiceConfig> = {
    authenticationScheme: 'Bearer',
    tokenUrl: '',
    refreshTokenUrl: '',
    isFormData: true,
    isJWT: true,
    scope: '',
    clientId: '',
    subSystemCode: '',
  };

  protected authRequestKey: Required<PnAuthRequestKey> = {
    username: 'username',
    password: 'password',
    refresh_token: 'refreshToken',
    subSystemCode: 'subSystemCode',
    deviceId: 'device_id',
    subSystem: 'subSystemCode',

  };

  protected authResponseKey: Required<PnAuthResponseKey> = {
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    expires_in: 'expires_in',
    scope: 'scope',
  };

  constructor(
    protected http: HttpClient,
    protected storage: PnStorageService,
    protected router: Router,
    @Optional() @Inject(pnUserAuthServiceConfigToken) userConfig?: PnAuthServiceConfig,
    @Optional() @Inject(pnUserAuthRequestKeyToken) userAuthRequestKeyConfig?: PnAuthRequestKey,
    @Optional() @Inject(pnUserAuthResponseKeyToken) userAuthResponseKeyConfig?: PnAuthResponseKey) {

    if (userConfig) {
      Object.assign(this.config, userConfig);
    }
    if (userAuthRequestKeyConfig) {
      Object.assign(this.authRequestKey, userAuthRequestKeyConfig);
    }
    if (userAuthResponseKeyConfig) {
      Object.assign(this.authResponseKey, userAuthResponseKeyConfig);
    }

    this.config.refreshTokenUrl = this.config.refreshTokenUrl || this.config.tokenUrl;
    // this.setStorageDependOnRememberMe();
    this.setAuthorize();
  }

  /*
   * check is logged in or token expires
   */
  get isLoggedIn(): boolean {
    if (this.getAccessToken()) {
      const expiresAt = this.storage.getItem('expires_at');
      const now = new Date();
      if (expiresAt && parseInt(expiresAt, 10) < now.getTime()) {
        return false;
      }
      return true;
    }
    return false;
  }

  /*
   * check user login with remember me or not
   */
  get isRememberMe() {
    return this.storage.getBooleanPersistent('remember_me');
  }

  /*
   * remove token and auth data in storage
   */
  logout(): void {
    this.storage.removeItem('access_token');
    this.storage.removeItem('refresh_token');
    this.storage.removeItem('nonce');
    this.storage.removeItem('expires_at');
    this.storage.removeItem('claims_obj');
    this.storage.removeItem('granted_scopes');
    this.storage.removeItemPersistent('remember_me');
    this.removeAdditionalAuthData();
  }

  /*
   * get access token
   */
  getAccessToken(): string | null {
    return this.storage.getItem('access_token');
  }

  /*
   * get authentication scheme
   */
  getAuthenticationScheme(): string {
    return this.config.authenticationScheme;
  }

  getRefreshToken(): string | null {
    return this.storage.getItem('refresh_token');
  }

  /*
   * to skip auto refresh token when these request urls got 401 unauthorized
   */
  skipUrlsForAutoRefreshToken(): string[] {
    return [this.config.tokenUrl, this.config.refreshTokenUrl];
  }

  setStorageDependOnRememberMe() {
    const rememberMe = this.storage.getItemPersistent('remember_me');
    if (rememberMe === 'true') {
      this.storage.usePersistent();
    } else if (rememberMe === 'false') {
      this.storage.useTemporary();
    } // else use default Storage
  }

  /*
   * request access_token and keep auth data in storage
   */
  requestTokenWithPasswordFlow$(username: string, password: string, rememberMe?: boolean, customQuery?: any): Observable<any> {
    if (!this.config.tokenUrl) {
      throw new Error('authApiUrl is needed to be set');
    }
    let deviceId = this.storage.getItemPersistent('device_id');
    if (!deviceId) {
      deviceId = uuidv4();
      this.storage.setItemPersistent('device_id', deviceId);
    }
    let body: any;
    const params = new HttpParams({ encoder: new WebHttpUrlEncodingCodec() });
    if (this.config.isFormData) {
      body = params
        .set(this.authRequestKey.username, username)
        .set(this.authRequestKey.password, password)
        .set(this.authRequestKey.subSystem, 'CMS');
      if (this.authRequestKey.deviceId && deviceId) {
        body = body.set(this.authRequestKey.deviceId, deviceId);
      }
      if (this.authRequestKey.subSystemCode && this.config.subSystemCode) {
        body = body.set(this.authRequestKey.subSystemCode, this.config.subSystemCode);
      }
    } else {
      body = {
        [this.authRequestKey.username]: username,
        [this.authRequestKey.password]: password,
        subSystem: 'CMS',
      };

      if (this.authRequestKey.deviceId && deviceId) {
        body[this.authRequestKey.deviceId] = deviceId;
      }
      if (this.authRequestKey.subSystemCode && this.config.subSystemCode) {
        body[this.authRequestKey.subSystemCode] = this.config.subSystemCode;
      }

    }

    if (rememberMe) {
      this.storage.setItemPersistent('remember_me', true);
    } else {
      this.storage.setItemPersistent('remember_me', false);
    }

    return this.requestToken(this.config.tokenUrl, body, customQuery);
  }

  /*
   * request new access_token by refresh_token and keep auth data in storage
   */
  requestRefreshToken$(customQuery?: any): Observable<any> {
    if (!this.config.refreshTokenUrl) {
      throw new Error('authApiUrl is need to be set');
    }
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError('no refresh token');
    }

    let body: any;
    const params = new HttpParams({ encoder: new WebHttpUrlEncodingCodec() });

    if (this.config.isFormData) {
      body = params
        .set(this.authRequestKey.refresh_token, refreshToken);
    } else {
      body = {
        [this.authRequestKey.refresh_token]: refreshToken,
      };
    }
    return this.requestToken(this.config.refreshTokenUrl, body, customQuery);
  }

  // general request token in common
  requestToken(url: string, body: any, customQuery?: any, headers = new HttpHeaders()): Observable<any> {
    if (customQuery) {
      if (this.config.isFormData) {
        for (const key of Object.getOwnPropertyNames(customQuery)) {
          body = body.set(key, customQuery[key]);
        }
      } else {
        body = Object.assign({}, body, customQuery);
      }
    }

    if (this.config.isFormData) {
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

    return this.http.post(url, body, { headers }).pipe(
      mergeMap((response: any) => {
        if (response) {
          if (this.config.isJWT) {
            const expiresIn = this.handleWithJwt(response);
            response.expires_in = expiresIn;
          }
          this.handleLonginSuccess(response);
        }
        return of(response);
      }),
    );
  }

  handleWithJwt(response) {
    const [claims, claimsJson] = this.decodeIdToken(response.access_token);
    this.storage.setItem('claims_obj', claimsJson);
    return response.expires_in || claims.exp;
  }

  handleLonginSuccess(response) {
    console.log('handleLonginSuccess', response);
    this.storeAccessToken(response.access_token, response.refresh_token, response.expires_in, response.scope);
    this.setAdditionalAuthData(response);
    this.setAuthorize();
  }


  storeAccessToken(accessToken: string, refreshToken?: string, expiresAt?: number, grantedScopes?: string) {
    this.storage.setItem('access_token', accessToken);

    if (refreshToken) {
      this.storage.setItem('refresh_token', refreshToken);
    }

    if (expiresAt) {
      // const now = new Date();
      // const expiresInMilliSeconds = now.getTime()+(60*60*1000);
      // const expiresAt = now.getTime() + expiresInMilliSeconds;
      this.storage.setItem('expires_at', '' + expiresAt * 1000);
    }

    if (grantedScopes) {
      this.storage.setItem('granted_scopes', JSON.stringify(grantedScopes.split('+')));
    }
  }

  decodeIdToken(idToken: string) {
    const tokenParts = idToken.split('.');
    const claimsBase64 = this.padBase64(tokenParts[1]);
    const claimsJson = this.b64DecodeUnicode(claimsBase64);
    const claims = JSON.parse(claimsJson);

    return [
      claims,
      claimsJson,
    ];
  }

  // override if any additional auth response data that need to keep
  getAdditionalAuthData(): string[] {
    return [];
  }

  setAdditionalAuthData(auth: any): void {
    const authData = this.getAdditionalAuthData();
    for (const data of authData) {
      if (auth[data] !== undefined) {
        this.storage.setItem(data, auth[data]);
      }
    }
  }

  // override to set authorize into this.can
  setAuthorize() {
  }

  removeAdditionalAuthData(): void {
    const authData = this.getAdditionalAuthData();
    for (const data of authData) {
      this.storage.removeItem(data);
    }
  }


  private padBase64(base64data: string): string {
    while (base64data.length % 4 !== 0) {
      base64data += '=';
    }
    return base64data;
  }

  private b64DecodeUnicode(str: string) {
    const base64 = str.replace(/\-/g, '+').replace(/\_/g, '/');

    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
  }

}
