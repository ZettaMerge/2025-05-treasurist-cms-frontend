import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FeAgentProfileComponent} from './fe-agent-profile/fe-agent-profile.component';
import {FeAgentProfileFormComponent} from './fe-agent-profile/fe-agent-profile-form/fe-agent-profile-form.component';
import {FeAgentProfileDetailComponent} from './fe-agent-profile/fe-agent-profile-detail/fe-agent-profile-detail.component';
import {FeCustomerServiceComponent} from './fe-customer-service/fe-customer-service.component';
import {FeSwitchingOrdersDetailComponent} from './fe-customer-service/fe-switching-orders/fe-switching-orders-detail/fe-switching-orders-detail.component';
import {FeDcaDetailComponent} from './fe-customer-service/fe-dca/fe-dca-detail/fe-dca-detail.component';
import {FeInvestmentPlanDetailComponent} from './fe-customer-service/fe-investment-plan/fe-investment-plan-detail/fe-investment-plan-detail.component';
import {FeRebalanceDetailComponent} from "./fe-customer-service/fe-rebalance/fe-rebalance-detail/fe-rebalance-detail.component";
import {PermissionEnum} from "@app/core/variables/permission.enum";
import {PermissionGuard} from "@app/core/guard/permission.guard";

const routes: Routes = [
  {
    path: 'agent',
    children: [
      {
        path: 'profile',
        children: [
          {
            path: '',
            component: FeAgentProfileComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.AgentProfile]
            }
          },
          {
            path: 'new',
            component: FeAgentProfileFormComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.AgentProfile]
            }
          },
          {
            path: 'detail/:id',
            component: FeAgentProfileDetailComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.AgentProfile]
            }
          },
        ],
      },
      {
        path: 'customer-service',
        children: [
          {
            path: '',
            component: FeCustomerServiceComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.AgentCustomerService]
            }
          },
          {
            path: 'switching-order/:id',
            component: FeSwitchingOrdersDetailComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.AgentCustomerService]
            }
          },
          {
            path: 'investment-plan/:id',
            component: FeInvestmentPlanDetailComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.AgentCustomerService]
            }
          },
          {
            path: 'rebalance/:id',
            component: FeRebalanceDetailComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.AgentCustomerService]
            }
          },
          {
            path: 'dca/:id',
            component: FeDcaDetailComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.AgentCustomerService]
            }
          },
        ],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule {
}
