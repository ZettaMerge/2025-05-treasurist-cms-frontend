import { NgModule } from '@angular/core';
import { AuditRiskRoutingModule } from './audit-risk-routing.module';
import { FeAuditRiskListComponent } from './fe-audit-risk-list/fe-audit-risk-list.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    FeAuditRiskListComponent
  ],
  imports: [
    SharedModule,
    AuditRiskRoutingModule
  ]
})
export class AuditRiskModule { }
