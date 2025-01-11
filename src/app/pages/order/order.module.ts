import { NgModule} from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OrderRoutingModule } from './order-routing.module';
import { FeTransactionComponent } from './fe-transaction/fe-transaction.component';
import { FeVulnerableTransactionComponent } from './fe-vulnerable-transaction/fe-vulnerable-transaction.component';
import { FeTransactionDetailComponent } from './fe-transaction/fe-transaction-detail/fe-transaction-detail.component';
import { FeOrderPlacementComponent } from './fe-order-placement/fe-order-placement.component';
import { FeOrderPlacementFormComponent } from './fe-order-placement/fe-order-placement-form/fe-order-placement-form.component';
import { FeValnerableTransactionDetailComponent } from './fe-vulnerable-transaction/fe-valnerable-transaction-detail/fe-valnerable-transaction-detail.component';
import { FeOrderPlacementDetailComponent } from './fe-order-placement/fe-order-placement-detail/fe-order-placement-detail.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FeOrderPlacementFormBuyComponent } from './fe-order-placement/fe-order-placement-form/fe-order-placement-form-buy/fe-order-placement-form-buy.component';
import { FeOrderPlacementFormSwitchComponent } from './fe-order-placement/fe-order-placement-form/fe-order-placement-form-switch/fe-order-placement-form-switch.component';
import { FeOrderPlacementFormDcaComponent } from './fe-order-placement/fe-order-placement-form/fe-order-placement-form-dca/fe-order-placement-form-dca.component';
import { FeOrderPlacementFormSellComponent } from './fe-order-placement/fe-order-placement-form/fe-order-placement-form-sell/fe-order-placement-form-sell.component';
import { FeSyncDataComponent } from './fe-sync-data/fe-sync-data.component';
import { FeSyncDataModalComponent } from './fe-sync-data-modal/fe-sync-data-modal.component';



@NgModule({
  declarations: [
    FeTransactionComponent,
    FeVulnerableTransactionComponent,
    FeTransactionDetailComponent,
    FeOrderPlacementComponent,
    FeOrderPlacementFormComponent,
    FeOrderPlacementDetailComponent,
    FeValnerableTransactionDetailComponent,
    FeOrderPlacementFormBuyComponent,
    FeOrderPlacementFormSwitchComponent,
    FeOrderPlacementFormDcaComponent,
    FeOrderPlacementFormSellComponent,
    FeSyncDataComponent,
    FeSyncDataModalComponent,
  ],
  imports: [
    SharedModule,
    OrderRoutingModule,
    NgbTypeaheadModule,
  ],
})
export class OrderModule { }
