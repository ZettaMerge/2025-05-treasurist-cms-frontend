import { NgModule } from '@angular/core';
import { FundIndexTypeRoutingModule } from './fund-index-type-routing.module';
import { FeFundIndexTypeFormComponent } from './fe-fund-index-type-form/fe-fund-index-type-form.component';
import { FeFundIndexTypeListComponent } from './fe-fund-index-type-list/fe-fund-index-type-list.component';
import { SharedModule } from '@shared/shared.module';
import { FeFundForIndexTypeListComponent } from './fe-fund-for-index-type-list/fe-fund-for-index-type-list.component';
import { FeRecalFundForIndexTypeComponent } from './fe-recal-fund-for-index-type/fe-recal-fund-for-index-type.component';


@NgModule({
  declarations: [
    FeFundIndexTypeFormComponent,
    FeFundIndexTypeListComponent,
    FeFundForIndexTypeListComponent,
    FeRecalFundForIndexTypeComponent
  ],
  imports: [
    SharedModule,
    FundIndexTypeRoutingModule
  ]
})
export class FundIndexTypeModule { }
