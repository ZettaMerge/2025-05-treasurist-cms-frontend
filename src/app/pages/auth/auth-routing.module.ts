import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeLoginComponent } from './fe-login/fe-login.component';
import { FeForgotPasswordComponent } from './fe-forgot-password/fe-forgot-password.component';
import { FeResetPasswordComponent } from './fe-reset-password/fe-reset-password.component';

const routes: Routes = [
  {
    path: 'auth/login',
    component: FeLoginComponent
  },
  {
    path: 'auth/forgot-password',
    component: FeForgotPasswordComponent
  },

  // {
  //   path: 'auth/reset-password',
  //   component: FeResetPasswordComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
