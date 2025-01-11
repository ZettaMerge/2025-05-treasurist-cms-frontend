import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeUserManagementComponent } from './fe-user-management/fe-user-management.component';
import {FeUserManagementFormComponent} from './fe-user-management/fe-user-management-form/fe-user-management-form.component';
import {PermissionGuard} from '@app/core/guard/permission.guard';
import {PermissionEnum} from '@app/core/variables/permission.enum';

const routes: Routes = [
  {
    path: 'user',
    children: [
      {
        path: '',
        component: FeUserManagementComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.UseRoleManagement]
        }
      },
      {
        path: 'new',
        component: FeUserManagementFormComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.UseRoleManagement],
        }
      },
      {
        path: 'edit/:id',
        canActivate: [PermissionGuard],
        component: FeUserManagementFormComponent,
        data: {
          permissions: [PermissionEnum.UseRoleManagement],
        }
      },
      {
        path: 'view/:id',
        canActivate: [PermissionGuard],
        component: FeUserManagementFormComponent,
        data: {
          permissions: [PermissionEnum.UseRoleManagement],
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
