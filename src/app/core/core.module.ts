import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  PnApiClientConfig,
  dateRequestFormatter,
  dateResponseReviver,
  PnAuthInterceptorConfig,
  PnAuthServiceConfig,
  PnAuthRequestKey,
  PnAuthResponseKey,
  PnStorageConfig,
  LibModule,
  PnDateRequestInterceptor,
  PnNoCacheInterceptor,
  pnUserApiClientConfigToken,
  pnUserStorageConfigToken,
} from '@postnerd-core';
import { pnUserAuthInterceptorConfigToken, pnUserAuthRequestKeyToken, pnUserAuthResponseKeyToken, pnUserAuthServiceConfigToken } from '@postnerd-core/auth/pn-user-config.token';

import { AuthService } from './auth/auth.service';
import { environment } from 'src/environments/environment';


export function initApiClientConfig(): PnApiClientConfig {
  return {
    pageHeaderResponseKeys: {
      pageCount: 'X-Paging-PageCount',
      totalCount: 'X-Paging-TotalRecordCount',
    },
    dateRequestFormatter,
    dateResponseReviver,
    // TODO check response error.
    // errorHandler: environment.production ? errorHandler : errorHandlerDebug,
  };
}

export function initAuthInterceptorConfigToken(): PnAuthInterceptorConfig {
  return {
    autoRefreshToken: true,
    loginScreenUrl: environment.loginScreenUrl,
  };
}

export function initAuthServiceConfig(): PnAuthServiceConfig {
  return {
    tokenUrl: environment.tokenUrl,
    refreshTokenUrl: `${environment.apiBaseUrl}/auth/refresh-token`,
    isFormData: false,
    isJWT: true,
    subSystemCode: 'ADM'
  };
}

const authRequestKey: PnAuthRequestKey = {
  username: 'username',
  password: 'password',
  subSystemCode: 'subSystemCode',
  subSystem: 'subSystem',
  deviceId: 'deviceId'
};

const authResponseKey: PnAuthResponseKey = {
  access_token: 'token',
};

export function initStorageConfig(): PnStorageConfig {
  return {
    storagePrefix: environment.storagePrefix,
    usePersistentAsDefault: true,
  };
}


@NgModule({
  declarations: [
  ],
  imports: [
    // lib
    LibModule.forRoot(),

    // internal
    // ApiModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: PnDateRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: PnNoCacheInterceptor, multi: true },
    { provide: pnUserApiClientConfigToken, useFactory: initApiClientConfig },
    { provide: pnUserAuthServiceConfigToken, useFactory: initAuthServiceConfig },
    { provide: pnUserAuthInterceptorConfigToken, useFactory: initAuthInterceptorConfigToken },
    { provide: pnUserAuthRequestKeyToken, useValue: authRequestKey },
    { provide: pnUserAuthResponseKeyToken, useValue: authResponseKey },
    { provide: pnUserStorageConfigToken, useFactory: initStorageConfig },
    AuthService,
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule) {

    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}

export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(
      `${moduleName} has already been loaded. Import Core modules in the AppModule only.`
    );
  }
}
