import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomNotificationListComponent } from './custom-notification-list/custom-notification-list.component';
import { CustomNotificationFormComponent } from './custom-notification-form/custom-notification-form.component';
import {CustomNotificationDetailComponent} from './custom-notification-detail/custom-notification-detail.component';
import {PermissionEnum} from "@app/core/variables/permission.enum";
import {PermissionGuard} from "@app/core/guard/permission.guard";

const routes: Routes = [
  {
    path: 'custom-notification',
    children: [
      {
        path: '',
        component: CustomNotificationListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.CustomNotification]
        }
      },
      {
        path: 'new',
        component: CustomNotificationFormComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.CustomNotification]
        }
      },
      {
        path: ':id',
        component: CustomNotificationFormComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.CustomNotification]
        }
      },
      {
        path: 'detail/:id',
        component: CustomNotificationDetailComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.CustomNotification]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomNotificationRoutingModule { }
