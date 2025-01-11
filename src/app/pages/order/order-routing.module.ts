import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeTransactionComponent } from './fe-transaction/fe-transaction.component';
import { FeVulnerableTransactionComponent } from './fe-vulnerable-transaction/fe-vulnerable-transaction.component';
import { FeTransactionDetailComponent } from './fe-transaction/fe-transaction-detail/fe-transaction-detail.component';
import {FeOrderPlacementComponent} from './fe-order-placement/fe-order-placement.component';
import {FeValnerableTransactionDetailComponent} from './fe-vulnerable-transaction/fe-valnerable-transaction-detail/fe-valnerable-transaction-detail.component';
import { FeOrderPlacementDetailComponent } from './fe-order-placement/fe-order-placement-detail/fe-order-placement-detail.component';
import {PermissionEnum} from '@app/core/variables/permission.enum';
import {PermissionGuard} from "@app/core/guard/permission.guard";
import { FeSyncDataComponent } from './fe-sync-data/fe-sync-data.component';

const routes: Routes = [
  {
    path: 'order',
    children: [
      {
        path: 'transaction',
        children: [
          {
            path: '',
            component: FeTransactionComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.OrderTransaction]
            }
          },
          {
            path: 'detail/:id',
            component: FeTransactionDetailComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.OrderTransaction]
            }
          },
          // NOTE เรียกใช้เมื่อ กด navigate มาจากหน้า customer
          {
            path: ':id/:mode',
            component: FeTransactionComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.OrderTransaction]
            }
          },
        ]
      },
      {
        path: 'vulnerable-transaction',
        children: [
          {
            path: '',
            component: FeVulnerableTransactionComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.OrderVulnerableTransaction]
            }
          },
          {
            path: 'detail/:id',
            component: FeValnerableTransactionDetailComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.OrderVulnerableTransaction]
            }
          }
        ]
      },
      {
        path: 'order-placement',
        children: [
          {
            path: '',
            component: FeOrderPlacementComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.OrderPlacement]
            }
          },
          {
            path: 'detail/:id',
            component: FeOrderPlacementDetailComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.OrderPlacement]
            }
          }
        ]
      },
      {
        path: 'sync-transaction',
        children: [
          {
            path: '',
            component: FeSyncDataComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.OrderTransaction]
            }
          },
          {
            path: 'detail/:id',
            component: FeTransactionDetailComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: [PermissionEnum.OrderTransaction]
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
export class OrderRoutingModule {
}
