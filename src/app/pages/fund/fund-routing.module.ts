import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FeFundListComponent} from './fe-fund-list/fe-fund-list.component';
import {FeFundDetailComponent} from './fe-fund-detail/fe-fund-detail.component';
import {PermissionEnum} from '@app/core/variables/permission.enum';
import {PermissionGuard} from "@app/core/guard/permission.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'fund',
        children: [
          {
            path: '',
            component: FeFundListComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.FundData]
            }
          },
          {
            path: 'detail/:id',
            component: FeFundDetailComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.FundData]
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundRoutingModule { }
