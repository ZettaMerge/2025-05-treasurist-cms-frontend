import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { PnStorageModule } from '../storage/pn-storage.module';
import {
  PnAuthServiceConfig, PnAuthInterceptorConfig,
  PnAuthRequestKey, PnAuthResponseKey,
} from './pn-auth.config';
import {
  pnUserAuthServiceConfigToken, pnUserAuthInterceptorConfigToken,
  pnUserAuthRequestKeyToken, pnUserAuthResponseKeyToken,
} from './pn-user-config.token';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    PnStorageModule,
  ],
})
export class PnAuthModule {
  static forRoot(
    config: {
      pnAuthServiceConfig?: PnAuthServiceConfig,
      pnAuthInterceptorConfig?: PnAuthInterceptorConfig,
      pnAuthRequestKey?: PnAuthRequestKey,
      pnAuthResponseKey?: PnAuthResponseKey,
    } = {},
  ): ModuleWithProviders<PnAuthModule> {
    return {
      ngModule: PnAuthModule,
      providers: [
        { provide: pnUserAuthServiceConfigToken, useValue: config.pnAuthServiceConfig },
        { provide: pnUserAuthInterceptorConfigToken, useValue: config.pnAuthInterceptorConfig },
        { provide: pnUserAuthRequestKeyToken, useValue: config.pnAuthRequestKey },
        { provide: pnUserAuthResponseKeyToken, useValue: config.pnAuthResponseKey },
      ],
    };
  }
}
