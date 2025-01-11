import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';


import {AccountRoutingModule} from './account-routing.module';
import {FeAccountAtsApprovalComponent} from './fe-account-ats-approval/fe-account-ats-approval.component';
import {FeAccountDetailComponent} from './fe-account-detail/fe-account-detail.component';
import {FeAccountLegalEntityDetailComponent} from './fe-account-legal-entity-detail/fe-account-legal-entity-detail.component';
import {FeOpenAccountFormInfoComponent} from './fe-open-account/fe-open-account-form-general/fe-open-account-form-info/fe-open-account-form-info.component';
import {FeOpenAccountFormAddressComponent} from './fe-open-account/fe-open-account-form-general/fe-open-account-form-address/fe-open-account-form-address.component';
import {FeOpenAccountFormCareerComponent} from './fe-open-account/fe-open-account-form-general/fe-open-account-form-career/fe-open-account-form-career.component';
import {FeOpenAccountFormSourceIncomeComponent} from './fe-open-account/fe-open-account-form-general/fe-open-account-form-source-income/fe-open-account-form-source-income.component';
import {FeOpenAccountFormConfirmImageStatusComponent} from './fe-open-account/fe-open-account-form-general/fe-open-account-form-confirm-image-status/fe-open-account-form-confirm-image-status.component';
import {FeOpenAccountListFileConfirmComponent} from './fe-open-account/fe-open-account-list-file-confirm/fe-open-account-list-file-confirm.component';
import {FeOpenAccountFormRiskAssessmentComponent} from './fe-open-account/fe-open-account-form-risk-assessment/fe-open-account-form-risk-assessment.component';
import {FeOpenAccountFormUploadFileComponent} from './fe-open-account/fe-open-account-form-upload-file/fe-open-account-form-upload-file.component';
import {FeAccountBankAccountDetailComponent} from './fe-account-bank-account-detail/fe-account-bank-account-detail.component';
import {FeOpenAccountListComponent} from './fe-open-account/fe-open-account-list/fe-open-account-list.component';
import {FeOpenAccountFormGeneralComponent} from './fe-open-account/fe-open-account-form-general/fe-open-account-form-general.component';
import {FeOpenAccountFormJuristicComponent} from './fe-open-account/fe-open-account-form-juristic/fe-open-account-form-juristic.component';
import {FeAccountAtsFormNoteComponent} from './fe-account-ats-form-note/fe-account-ats-form-note.component';
import {FeOpenAccountFormJuristicInfoComponent} from './fe-open-account/fe-open-account-form-juristic/fe-open-account-form-juristic-info/fe-open-account-form-juristic-info.component';
import {FeOpenAccountFormJuristicAddressComponent} from './fe-open-account/fe-open-account-form-juristic/fe-open-account-form-juristic-address/fe-open-account-form-juristic-address.component';
import {FeOpenAccountFormJuristicListDirectorComponent} from './fe-open-account/fe-open-account-form-juristic/fe-open-account-form-juristic-list-director/fe-open-account-form-juristic-list-director.component';
import {FeOpenAccountFormJuristicListPuppetHolderComponent} from './fe-open-account/fe-open-account-form-juristic/fe-open-account-form-juristic-list-puppet-holder/fe-open-account-form-juristic-list-puppet-holder.component';
import {FeOpenAccountFormJuristicInfoBeneficiaryComponent} from './fe-open-account/fe-open-account-form-juristic/fe-open-account-form-juristic-info-beneficiary/fe-open-account-form-juristic-info-beneficiary.component';
import {FeOpenAccountFormJuristicInfoMutualFundTransactionComponent} from './fe-open-account/fe-open-account-form-juristic/fe-open-account-form-juristic-info-mutual-fund-transaction/fe-open-account-form-juristic-info-mutual-fund-transaction.component';
import {FeOpenAccountFormJuristicInfoAccountOpenComponent} from './fe-open-account/fe-open-account-form-juristic/fe-open-account-form-juristic-info-account-open/fe-open-account-form-juristic-info-account-open.component';
import {FeOpenAccountFormCheckCriminalRecordComponent} from './fe-open-account/fe-open-account-form-general/fe-open-account-form-confirm-image-status/fe-open-account-form-check-criminal-record/fe-open-account-form-check-criminal-record.component';
import {FeOpenAccountFormCheckAmericanCitizenComponent} from './fe-open-account/fe-open-account-form-general/fe-open-account-form-confirm-image-status/fe-open-account-form-check-american-citizen/fe-open-account-form-check-american-citizen.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FeRejectDetailComponent} from './fe-reject-detail/fe-reject-detail.component';
import { FeFormAccountFormCurrentAddressComponent } from './fe-open-account/fe-open-account-form-general/fe-form-account-form-current-address/fe-form-account-form-current-address.component';
import { FeFormAccountFormWorkAddressComponent } from './fe-open-account/fe-open-account-form-general/fe-form-account-form-work-address/fe-form-account-form-work-address.component';
import { FeFormAccountFormMailAddressComponent } from './fe-open-account/fe-open-account-form-general/fe-form-account-form-mail-address/fe-form-account-form-mail-address.component';
import { FeAccountDetailCddScoreComponent } from './fe-account-detail-cdd-score/fe-account-detail-cdd-score.component';

@NgModule({
    declarations: [
        FeAccountAtsApprovalComponent,
        FeAccountDetailComponent,
        FeAccountLegalEntityDetailComponent,
        FeOpenAccountFormInfoComponent,
        FeOpenAccountFormAddressComponent,
        FeOpenAccountFormCareerComponent,
        FeOpenAccountFormSourceIncomeComponent,
        FeOpenAccountFormConfirmImageStatusComponent,
        FeOpenAccountListFileConfirmComponent,
        FeOpenAccountFormRiskAssessmentComponent,
        FeOpenAccountFormUploadFileComponent,
        FeAccountBankAccountDetailComponent,
        FeOpenAccountListComponent,
        FeOpenAccountFormGeneralComponent,
        FeOpenAccountFormJuristicComponent,
        FeAccountAtsFormNoteComponent,
        FeOpenAccountFormJuristicInfoComponent,
        FeOpenAccountFormJuristicAddressComponent,
        FeOpenAccountFormJuristicListDirectorComponent,
        FeOpenAccountFormJuristicListPuppetHolderComponent,
        FeOpenAccountFormJuristicInfoBeneficiaryComponent,
        FeOpenAccountFormJuristicInfoMutualFundTransactionComponent,
        FeOpenAccountFormJuristicInfoAccountOpenComponent,
        FeOpenAccountFormCheckCriminalRecordComponent,
        FeOpenAccountFormCheckAmericanCitizenComponent,
        FeRejectDetailComponent,
        FeFormAccountFormCurrentAddressComponent,
        FeFormAccountFormWorkAddressComponent,
        FeFormAccountFormMailAddressComponent,
        FeAccountDetailCddScoreComponent,
    ],
  exports: [
    FeOpenAccountFormRiskAssessmentComponent,
    FeAccountAtsFormNoteComponent,
    FeAccountDetailCddScoreComponent
  ],
    imports: [
        SharedModule,
        AccountRoutingModule,
        FormsModule,
        FormsModule,
    ]
})
export class AccountModule {
}
