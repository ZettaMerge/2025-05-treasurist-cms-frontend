import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { PnStorageConfig } from './pn-storage.config';
import { PnStorageService } from './pn-storage.service';
import { pnUserStorageConfigToken } from './pn-user-config.token';

@NgModule({
  imports: [
    CommonModule,
  ],
})
export class PnStorageModule {
  static forRoot(
    config?: PnStorageConfig,
  ): ModuleWithProviders<PnStorageModule> {
    return {
      ngModule: PnStorageModule,
      providers: [
        { provide: pnUserStorageConfigToken, useValue: config },
        PnStorageService,
      ],
    };
  }
}
