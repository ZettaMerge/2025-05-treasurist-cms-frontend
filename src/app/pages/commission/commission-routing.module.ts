import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeCommissionFeeAgentComponent } from './fe-commission-fee-agent/fe-commission-fee-agent.component';
import { FeCommissionFeeReportListComponent } from './fe-commission-fee-agent/fe-commission-fee-report-list/fe-commission-fee-report-list.component';
import { FeCommissionFeeReportComponent } from './fe-commission-fee-agent/fe-commission-fee-report/fe-commission-fee-report.component';
import { FeCommissionFeePaymentFormComponent } from './fe-commission-fee-payment/fe-commission-fee-payment-form/fe-commission-fee-payment-form.component';
import { FeCommissionFeePaymentComponent } from './fe-commission-fee-payment/fe-commission-fee-payment.component';
import { FeCommissionTsrIntensiveRateComponent } from './fe-commission-tsr-intensive-rate/fe-commission-tsr-intensive-rate.component';
import {PermissionEnum} from "@app/core/variables/permission.enum";
import {PermissionGuard} from "@app/core/guard/permission.guard";


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'commission',
        children: [
          {
            path: 'commission-fee',
            component: FeCommissionFeeAgentComponent,
            canActivate: [PermissionGuard],
          },
          {
            path: 'payment',
            component: FeCommissionFeePaymentComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.CommissionPayment]
            }
          },
          {
            path: 'payment/new',
            component: FeCommissionFeePaymentFormComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.CommissionPayment]
            }
          },
          {
            path: 'payment/:id',
            component: FeCommissionFeePaymentFormComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.CommissionPayment]
            }
          },
          {
            path: 'commission-fee/report/:id',
            component: FeCommissionFeeReportListComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.CommissionAgentFeeReport]
            }
          },
          {
            path: 'commission-fee/report-detail/:icLicense/:agentId/:paymentTermId/:type',
            component: FeCommissionFeeReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.CommissionAgentFeeReport]
            }
          },
          {
            path: 'tsr-incentive-rate',
            component: FeCommissionTsrIntensiveRateComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.CommissionTSRIncentiveRate]
            }
          },
        ]
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommissionRoutingModule { }
