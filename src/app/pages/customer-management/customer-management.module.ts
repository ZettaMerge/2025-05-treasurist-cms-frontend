import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';

import {CustomerManagementRoutingModule} from './customer-management-routing.module';
import {FeCustomerListComponent} from './fe-customer-list/fe-customer-list.component';
import {FeCustomerProfileComponent} from './fe-customer-profile/fe-customer-profile.component';
import {FeCustomerInfoComponent} from './fe-customer-profile/fe-customer-info/fe-customer-info.component';
import {FeCustomerBankAccountComponent} from './fe-customer-profile/fe-customer-bank-account/fe-customer-bank-account.component';
import {FeRegulatoryCddChecklistComponent} from './fe-customer-regulatory-monitoring/fe-regulatory-cdd-checklist/fe-regulatory-cdd-checklist.component';
import {FeRegulatoryPepListComponent} from './fe-customer-regulatory-monitoring/fe-regulatory-pep-list/fe-regulatory-pep-list.component';
import {FeCustomerRegulatoryMonitoringComponent} from './fe-customer-regulatory-monitoring/fe-customer-regulatory-monitoring.component';
import {FeRegulatoryAmloListComponent} from './fe-customer-regulatory-monitoring/fe-regulatory-amlo-list/fe-regulatory-amlo-list.component';
import {FeRegulatoryFormComponent} from './fe-customer-regulatory-monitoring/fe-regulatory-form/fe-regulatory-form.component';
import {FormsModule} from '@angular/forms';
import {FeCustomerProtfolioComponent} from './fe-customer-profile/fe-customer-protfolio/fe-customer-protfolio.component';
import {FeCustomerPortfolioDetailComponent} from './fe-customer-profile/fe-customer-protfolio/fe-customer-portfolio-detail/fe-customer-portfolio-detail.component';
import {NgbModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {FeCustomerProfileInfoLegeEntityComponent} from './fe-customer-profile/fe-customer-profile-info-lege-entity/fe-customer-profile-info-lege-entity.component';
import {FeCustomerPlanComponent} from './fe-customer-profile/fe-customer-plan/fe-customer-plan.component';
import {AccountModule} from '../account/account.module';
import {FeCustomerPlanFileComponent } from './fe-customer-profile/fe-customer-plan-file/fe-customer-plan-file.component';
import { FeCustomerDcaComponent } from './fe-customer-profile/fe-customer-dca/fe-customer-dca.component';
import { FeCustomerDividendComponent } from './fe-customer-profile/fe-customer-dividend/fe-customer-dividend.component';
import { FeSyncAccountComponent } from './fe-sync-account/fe-sync-account.component';


@NgModule({
  declarations: [
    FeCustomerListComponent,
    FeCustomerProfileComponent,
    FeCustomerInfoComponent,
    FeCustomerBankAccountComponent,
    FeRegulatoryCddChecklistComponent,
    FeRegulatoryPepListComponent,
    FeCustomerRegulatoryMonitoringComponent,
    FeRegulatoryAmloListComponent,
    FeRegulatoryFormComponent,
    FeCustomerProtfolioComponent,
    FeCustomerPortfolioDetailComponent,
    FeCustomerProfileInfoLegeEntityComponent,
    FeCustomerPlanComponent,
    FeCustomerPlanFileComponent,
    FeCustomerDcaComponent,
    FeCustomerDividendComponent,
    FeSyncAccountComponent
  ],
  imports: [
    SharedModule,
    CustomerManagementRoutingModule,
    FormsModule,
    FormsModule,
    NgbProgressbarModule,
    NgbModule,
    FormsModule,
    AccountModule,
  ]
})
export class CustomerManagementModule {
}
