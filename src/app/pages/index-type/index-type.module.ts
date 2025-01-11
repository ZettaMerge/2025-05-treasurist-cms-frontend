import { NgModule } from '@angular/core';
import { IndexTypeRoutingModule } from './index-type-routing.module';
import { FeIndexTypeListComponent } from './fe-index-type-list/fe-index-type-list.component';
import { FeIndexTypeFormComponent } from './fe-index-type-form/fe-index-type-form.component';
import { SharedModule } from '@shared/shared.module';
import { FeRecalFundIndexComponent } from './fe-recal-fund-index/fe-recal-fund-index.component';


@NgModule({
  declarations: [
    FeIndexTypeListComponent,
    FeIndexTypeFormComponent,
    FeRecalFundIndexComponent
  ],
  imports: [
    SharedModule,
    IndexTypeRoutingModule
  ]
})
export class IndexTypeModule { }
