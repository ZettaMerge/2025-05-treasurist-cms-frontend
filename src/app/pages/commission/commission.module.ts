import { NgModule } from '@angular/core';

import { CommissionRoutingModule } from './commission-routing.module';
import { FeCommissionFeeAgentComponent } from './fe-commission-fee-agent/fe-commission-fee-agent.component';
import { FeCommissionFeeReportComponent } from './fe-commission-fee-agent/fe-commission-fee-report/fe-commission-fee-report.component';
import { FeCommissionFeeReportListComponent } from './fe-commission-fee-agent/fe-commission-fee-report-list/fe-commission-fee-report-list.component';
import { SharedModule } from '@shared/shared.module';
import { FeCommissionFeePaymentComponent } from './fe-commission-fee-payment/fe-commission-fee-payment.component';
import { FeCommissionFeePaymentFormComponent } from './fe-commission-fee-payment/fe-commission-fee-payment-form/fe-commission-fee-payment-form.component';
import { FeCommissionTsrIntensiveRateComponent } from './fe-commission-tsr-intensive-rate/fe-commission-tsr-intensive-rate.component';


@NgModule({
  declarations: [
    FeCommissionFeeAgentComponent,
    FeCommissionFeeReportComponent,
    FeCommissionFeeReportListComponent,
    FeCommissionFeePaymentComponent,
    FeCommissionFeePaymentFormComponent,
    FeCommissionTsrIntensiveRateComponent
  ],
  imports: [
    SharedModule,
    CommissionRoutingModule
  ]
})
export class CommissionModule { }
