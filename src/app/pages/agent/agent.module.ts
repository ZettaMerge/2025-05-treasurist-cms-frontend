import { NgModule } from '@angular/core';


import { AgentRoutingModule } from './agent-routing.module';
import { FeAgentProfileComponent } from './fe-agent-profile/fe-agent-profile.component';
import {SharedModule} from '@shared/shared.module';
import { FeAgentProfileFormComponent } from './fe-agent-profile/fe-agent-profile-form/fe-agent-profile-form.component';
import { FeAgentProfileDetailComponent } from './fe-agent-profile/fe-agent-profile-detail/fe-agent-profile-detail.component';
import { CurrentAddressFormComponent } from './fe-agent-profile/fe-agent-profile-form/current-address-form/current-address-form.component';
import { ProfileFormComponent } from './fe-agent-profile/fe-agent-profile-form/profile-form/profile-form.component';
import { FeCustomerServiceComponent } from './fe-customer-service/fe-customer-service.component';
import { FeSwitchingOrdersComponent } from './fe-customer-service/fe-switching-orders/fe-switching-orders.component';
import { FeInvestmentPlanComponent } from './fe-customer-service/fe-investment-plan/fe-investment-plan.component';
import { FeRebalanceComponent } from './fe-customer-service/fe-rebalance/fe-rebalance.component';
import { FeDcaComponent } from './fe-customer-service/fe-dca/fe-dca.component';
import { FeDcaDetailComponent } from './fe-customer-service/fe-dca/fe-dca-detail/fe-dca-detail.component';
import { FeSwitchingOrdersDetailComponent } from './fe-customer-service/fe-switching-orders/fe-switching-orders-detail/fe-switching-orders-detail.component';
import { FeInvestmentPlanDetailComponent } from './fe-customer-service/fe-investment-plan/fe-investment-plan-detail/fe-investment-plan-detail.component';
import { FeRebalanceDetailComponent } from './fe-customer-service/fe-rebalance/fe-rebalance-detail/fe-rebalance-detail.component';


@NgModule({
  declarations: [
    FeAgentProfileComponent,
    FeAgentProfileFormComponent,
    FeAgentProfileDetailComponent,
    CurrentAddressFormComponent,
    ProfileFormComponent,
    FeCustomerServiceComponent,
    FeSwitchingOrdersComponent,
    FeInvestmentPlanComponent,
    FeRebalanceComponent,
    FeDcaComponent,
    FeDcaDetailComponent,
    FeSwitchingOrdersDetailComponent,
    FeInvestmentPlanDetailComponent,
    FeRebalanceDetailComponent,
  ],
  imports: [
    SharedModule,
    AgentRoutingModule
  ]
})
export class AgentModule { }
