import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeAccountAtsApprovalComponent } from './fe-account-ats-approval/fe-account-ats-approval.component';
import { FeAccountBankAccountDetailComponent } from './fe-account-bank-account-detail/fe-account-bank-account-detail.component';
import { FeAccountDetailComponent } from './fe-account-detail/fe-account-detail.component';
import { FeAccountLegalEntityDetailComponent } from './fe-account-legal-entity-detail/fe-account-legal-entity-detail.component';
import { FeOpenAccountFormGeneralComponent } from './fe-open-account/fe-open-account-form-general/fe-open-account-form-general.component';
import { FeOpenAccountFormJuristicComponent } from './fe-open-account/fe-open-account-form-juristic/fe-open-account-form-juristic.component';
import { FeOpenAccountListComponent } from './fe-open-account/fe-open-account-list/fe-open-account-list.component';
const routes: Routes = [
  {
    path: 'account',
    children: [
      {
        path: 'account-ats-approval',
        children: [
          {
            path: '',
            component: FeAccountAtsApprovalComponent
          },
          {
            path: 'account-detail/:id',
            component: FeAccountDetailComponent
          },
          {
            path: 'account-detail/legal/:id',
            component: FeAccountLegalEntityDetailComponent
          },
          {
            path: 'bank-account-detail',
            component: FeAccountBankAccountDetailComponent
          },

        ]
      },
      {
        path: 'open-account',
        children: [
          {
            path: '',
            component: FeOpenAccountListComponent
          },
          {
            path: 'form-general',
            component: FeOpenAccountFormGeneralComponent
          },
          {
            path: 'form-juristic',
            component: FeOpenAccountFormJuristicComponent
          },
          {
            path: 'form-general/:id',
            component: FeOpenAccountFormGeneralComponent
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
