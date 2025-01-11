import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { ContentRoutingModule } from './content-routing.module';
import { FeContentManagementComponent } from './fe-content-management/fe-content-management.component';
import { FeTermsConditionComponent } from './fe-content-management/fe-terms-condition/fe-terms-condition.component';
import { FeTermsConditionDetailComponent } from './fe-content-management/fe-terms-condition/fe-terms-condition-detail/fe-terms-condition-detail.component';
import { FeTermsConditionFormComponent } from './fe-content-management/fe-terms-condition/fe-terms-condition-form/fe-terms-condition-form.component';
import { FeCustomerListComponent } from './fe-content-management/fe-terms-condition/fe-terms-condition-detail/fe-customer-list/fe-customer-list.component';
import { FeNdidComponent } from './fe-content-management/fe-ndid/fe-ndid.component';
import { FeNdidDetailComponent } from './fe-content-management/fe-ndid/fe-ndid-detail/fe-ndid-detail.component';
import { FeNdidFormComponent } from './fe-content-management/fe-ndid/fe-ndid-form/fe-ndid-form.component';
import { FeCustomerNdidListComponent } from './fe-content-management/fe-ndid/fe-customer-ndid-list/fe-customer-ndid-list.component';
import { FeInformationComponent } from './fe-content-management/fe-faqs/fe-faqs.component';
import { FeFaqsFormComponent } from './fe-content-management/fe-faqs/fe-faqs-form/fe-faqs-form.component';
import { FePDPAComponent } from './fe-content-management/fe-pdpa/fe-pdpa.component';
import { FePDPAFormCreateComponent } from './fe-content-management/fe-pdpa/fe-pdpa-form-create/fe-pdpa-form-create.component';
import { FePdpaDetailComponent } from './fe-content-management/fe-pdpa/fe-pdpa-detail/fe-pdpa-detail.component';
import { FePdpaCustomerAcceptListComponent } from './fe-content-management/fe-pdpa/fe-pdpa-customer-accept-list/fe-pdpa-customer-accept-list.component';
import { FeGeneralContactUsComponent } from './fe-content-management/fe-general-contact-us/fe-general-contact-us.component';
import { FeGeneralContactUsFormCreateComponent } from './fe-content-management/fe-general-contact-us/fe-general-contact-us-form/fe-general-contact-us-form.component';
import { FeGeneralAnnouncementComponent } from './fe-content-management/fe-general-announcement/fe-general-announcement.component';
import { FeGeneralAnnouncementFormCreateComponent } from './fe-content-management/fe-general-announcement/fe-general-announcement-form-create/fe-general-announcement-form-create.component';
import { FeGeneralAnnouncementDetailComponent } from './fe-content-management/fe-general-announcement/fe-general-announcement-detail/fe-general-announcement-detail.component';
import {FormsModule} from '@angular/forms';
import { FeTermsConditionListComponent } from './fe-content-management/fe-terms-condition/fe-terms-condition-list/fe-terms-condition-list.component';
import { FeTermsConditionListCustomerComponent } from './fe-content-management/fe-terms-condition/fe-terms-condition-list-customer/fe-terms-condition-list-customer.component';
import { FePdpaListComponent } from './fe-content-management/fe-pdpa/fe-pdpa-list/fe-pdpa-list.component';
import { FeNdidListComponent } from './fe-content-management/fe-ndid/fe-ndid-list/fe-ndid-list.component';
import { FeGeneralFileListComponent } from './fe-content-management/fe-general-file/fe-general-file-list/fe-general-file-list.component';
import { FeGeneralFileFormModalComponent } from './fe-content-management/fe-general-file/fe-general-file-form-modal/fe-general-file-form-modal.component';
import { FeAboutUsComponent } from './fe-content-management/fe-about-us/fe-about-us.component';
import { FeAboutUsFormCreateComponent } from './fe-content-management/fe-about-us/fe-about-us-form/fe-about-us-form.component';
import { FeAgentRegistrationComponent } from './fe-content-management/fe-agent-registration/fe-agent-registration.component';
import { FeAgentRegistrationFormCreateComponent } from './fe-content-management/fe-agent-registration/fe-agent-registration-form/fe-agent-registration-form.component';



@NgModule({
  declarations: [
    FeContentManagementComponent,
    FeTermsConditionComponent,
    FeTermsConditionDetailComponent,
    FeTermsConditionFormComponent,
    FeCustomerListComponent,
    FeNdidComponent,
    FeNdidDetailComponent,
    FeNdidFormComponent,
    FeCustomerNdidListComponent,
    FeInformationComponent,
    FeFaqsFormComponent,
    FePDPAComponent,
    FePDPAFormCreateComponent,
    FePdpaDetailComponent,
    FePdpaCustomerAcceptListComponent,
    FeGeneralContactUsComponent,
    FeGeneralContactUsFormCreateComponent,
    FeGeneralAnnouncementComponent,
    FeGeneralAnnouncementFormCreateComponent,
    FeGeneralAnnouncementDetailComponent,
    FeTermsConditionListComponent,
    FeTermsConditionListCustomerComponent,
    FePdpaListComponent,
    FeNdidListComponent,
    FeGeneralFileListComponent,
    FeGeneralFileFormModalComponent,
    FeAboutUsComponent,
    FeAboutUsFormCreateComponent,
    FeAgentRegistrationComponent,
    FeAgentRegistrationFormCreateComponent,
  ],
    imports: [
        SharedModule,
        ContentRoutingModule,
        FormsModule,
    ]
})
export class ContentModule { }
