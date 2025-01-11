import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeFundIndexTypeListComponent } from './fe-fund-index-type-list/fe-fund-index-type-list.component';
import { FeFundForIndexTypeListComponent } from './fe-fund-for-index-type-list/fe-fund-for-index-type-list.component';
import { PermissionGuard } from '@app/core/guard/permission.guard';
import { PermissionEnum } from '@app/core/variables/permission.enum';

const routes: Routes = [
  {

    path: 'fund-index',
    children: [
      {
        path: 'fund-index-type',
        component: FeFundIndexTypeListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.FundIndex]
        }
      },
      {
        path: 'fund-for-index-type',
        component: FeFundForIndexTypeListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.FundsAllIndex]
        }
      },
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundIndexTypeRoutingModule { }
