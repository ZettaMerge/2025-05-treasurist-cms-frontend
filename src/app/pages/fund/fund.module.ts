import { NgModule } from '@angular/core';

import { FundRoutingModule } from './fund-routing.module';
import { FeFundListComponent } from './fe-fund-list/fe-fund-list.component';
import { FeFundDetailComponent } from './fe-fund-detail/fe-fund-detail.component';
import { SharedModule } from '@shared/shared.module';
import { FeFundSyncComponent } from './fe-fund-sync/fe-fund-sync.component';
import { FeFundNavSyncComponent } from './fe-fund-nav-sync/fe-fund-nav-sync.component';
import { FeUpdateFundNameComponent } from './fe-update-fund-name/fe-update-fund-name.component';


@NgModule({
  declarations: [
    FeFundListComponent,
    FeFundDetailComponent,
    FeFundSyncComponent,
    FeFundNavSyncComponent,
    FeUpdateFundNameComponent
  ],
  imports: [
    SharedModule,
    FundRoutingModule,
  ]
})
export class FundModule { }
