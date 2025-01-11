import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FeCustomerListComponent} from './fe-customer-list/fe-customer-list.component';
import {FeCustomerProfileComponent} from './fe-customer-profile/fe-customer-profile.component';
import {FeCustomerRegulatoryMonitoringComponent} from './fe-customer-regulatory-monitoring/fe-customer-regulatory-monitoring.component';
import {FeCustomerDcaComponent} from './fe-customer-profile/fe-customer-dca/fe-customer-dca.component';
import {FeCustomerDividendComponent} from './fe-customer-profile/fe-customer-dividend/fe-customer-dividend.component';
import {PermissionGuard} from "@app/core/guard/permission.guard";
import {PermissionEnum} from "@app/core/variables/permission.enum";

const routes: Routes = [
  {
    path: 'customer',
    children: [
      {
        path: 'list',
        children: [
          {
            path: '',
            component: FeCustomerListComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.CustomerList]
            }
          },
          {
            path: 'profile/:id',
            component: FeCustomerProfileComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.CustomerList]
            }
          },
          {
            path: ':icLicense/:teamId',
            component: FeCustomerListComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.CustomerList]
            }
          },
        ],
      },
      {
        path: 'dca/:fcnAccountId',
        component: FeCustomerDcaComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.OrderTransaction]
        }

      },
      {
        path: 'dividend/:fcnAccountId',
        component: FeCustomerDividendComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.OrderTransaction]
        }
      },
      {
        path: 'regulatory-monitoring',
        children: [
          {
            path: '',
            component: FeCustomerRegulatoryMonitoringComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.CustomerRegulatoryMonitoring]
            }
          },
        ],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerManagementRoutingModule {
}
