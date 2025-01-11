import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '@shared/shared.module';

import { FeLoginComponent } from './fe-login/fe-login.component';
import { RouterModule } from '@angular/router';
import { FeForgotPasswordComponent } from './fe-forgot-password/fe-forgot-password.component';
import { FeResetPasswordComponent } from './fe-reset-password/fe-reset-password.component';
import { FeConfirmResetPasswordModalComponent } from './fe-confirm-reset-password-modal/fe-confirm-reset-password-modal.component';


@NgModule({
  declarations: [
    FeLoginComponent,
    FeForgotPasswordComponent,
    FeResetPasswordComponent,
    FeConfirmResetPasswordModalComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    RouterModule,
  ]
})
export class AuthModule { }
