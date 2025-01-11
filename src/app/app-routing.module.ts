import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';
import { ContentWithSidebarComponent } from '@layouts/content-with-sidebar/content-with-sidebar.component';
import { ContentLayoutComponent } from '@layouts/content/content-layout.component';
import { AuthGuard } from './core/auth/auth.guard';
import { FeResetPasswordComponent } from './pages/auth/fe-reset-password/fe-reset-password.component';
import {PermissionGuard} from "@app/core/guard/permission.guard";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'auth/reset-password',
        component: FeResetPasswordComponent,
      },
    ]

  },
  {
    path: '',
    component: ContentWithSidebarComponent,
    canActivate: [AuthGuard, PermissionGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/storybook/storybook.module').then((m) => m.StorybookModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/customer-management/customer-management.module').then((m) => m.CustomerManagementModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/order/order.module').then((m) => m.OrderModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/account/account.module').then((m) => m.AccountModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/content/content.module').then((m) => m.ContentModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/user/user.module').then((m) => m.UserModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/custom-notification/custom-notification.module').then((m) => m.CustomNotificationModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/fund/fund.module').then((m) => m.FundModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/agent/agent.module').then((m) => m.AgentModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/commission/commission.module').then((m) => m.CommissionModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/audit-risk/audit-risk.module').then((m) => m.AuditRiskModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/news/news.module').then((m) => m.NewsModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/index-type/index-type.module').then((m) => m.IndexTypeModule),
      },
      {
        path: '',
        loadChildren: () => import('./pages/fund-index-type/fund-index-type.module').then((m) => m.FundIndexTypeModule),
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'pages/error'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  // imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
