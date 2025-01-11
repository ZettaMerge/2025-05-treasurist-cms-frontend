import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { FeUserManagementComponent } from './fe-user-management/fe-user-management.component';
import { SharedModule } from '@shared/shared.module';
import { FeUserManagementFormComponent } from './fe-user-management/fe-user-management-form/fe-user-management-form.component';
import { FeUserManagementSetPermissionFormComponent } from './fe-user-management/fe-user-management-set-permission-form/fe-user-management-set-permission-form.component';
import { FeUserManagementSetUserFormComponent } from './fe-user-management/fe-user-management-set-user-form/fe-user-management-set-user-form.component';
import {CommonModule} from "@angular/common";
import { UserFormComponent } from './fe-user-management/fe-user-management-set-user-form/user-form/user-form.component';


@NgModule({
  declarations: [
    FeUserManagementComponent,
    FeUserManagementFormComponent,
    FeUserManagementSetPermissionFormComponent,
    FeUserManagementSetUserFormComponent,
    UserFormComponent
  ],
    imports: [
        SharedModule,
        UserRoutingModule,
        CommonModule,
        CommonModule
    ]
})
export class UserModule { }
