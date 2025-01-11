import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FeAuditRiskListComponent} from './fe-audit-risk-list/fe-audit-risk-list.component';
import {PermissionEnum} from "@app/core/variables/permission.enum";
import {PermissionGuard} from "@app/core/guard/permission.guard";

const routes: Routes = [
  {
    path: 'audit-risk',
    component: FeAuditRiskListComponent,
    canActivate: [PermissionGuard],
    data: {
      permissions: [PermissionEnum.AuditRisk]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRiskRoutingModule { }
