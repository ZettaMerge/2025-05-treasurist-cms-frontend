import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PnApiClientConfig } from './pn-api-client.config';
import { PnApiClientService } from './pn-api-client.service';
import { pnUserApiClientConfigToken } from './pn-user-config.token';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
})
export class PnApiClientModule {
  static forRoot(
    config?: PnApiClientConfig,
  ): ModuleWithProviders<PnApiClientModule> {
    return {
      ngModule: PnApiClientModule,
      providers: [
        { provide: pnUserApiClientConfigToken, useValue: config },
        PnApiClientService,
      ],
    };
  }
}
