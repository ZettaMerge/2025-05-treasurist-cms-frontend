import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FeContentManagementComponent} from './fe-content-management/fe-content-management.component';
import {FePDPAFormCreateComponent} from './fe-content-management/fe-pdpa/fe-pdpa-form-create/fe-pdpa-form-create.component';
import {FePDPAComponent} from './fe-content-management/fe-pdpa/fe-pdpa.component';
import {FeTermsConditionComponent} from './fe-content-management/fe-terms-condition/fe-terms-condition.component';
import {FeGeneralContactUsFormCreateComponent} from './fe-content-management/fe-general-contact-us/fe-general-contact-us-form/fe-general-contact-us-form.component';
import {FeGeneralAnnouncementComponent} from './fe-content-management/fe-general-announcement/fe-general-announcement.component';
import {FeGeneralAnnouncementFormCreateComponent} from './fe-content-management/fe-general-announcement/fe-general-announcement-form-create/fe-general-announcement-form-create.component';
import {FeGeneralAnnouncementDetailComponent} from './fe-content-management/fe-general-announcement/fe-general-announcement-detail/fe-general-announcement-detail.component';
import {FeTermsConditionFormComponent} from './fe-content-management/fe-terms-condition/fe-terms-condition-form/fe-terms-condition-form.component';
import {FeNdidComponent} from './fe-content-management/fe-ndid/fe-ndid.component';
import {FeNdidFormComponent} from './fe-content-management/fe-ndid/fe-ndid-form/fe-ndid-form.component';
import {FeInformationComponent} from './fe-content-management/fe-faqs/fe-faqs.component';
import {FeFaqsFormComponent} from './fe-content-management/fe-faqs/fe-faqs-form/fe-faqs-form.component';
import {FeGeneralFileListComponent} from './fe-content-management/fe-general-file/fe-general-file-list/fe-general-file-list.component';
import {FeGeneralFileFormModalComponent} from './fe-content-management/fe-general-file/fe-general-file-form-modal/fe-general-file-form-modal.component';
import {FeAboutUsFormCreateComponent} from './fe-content-management/fe-about-us/fe-about-us-form/fe-about-us-form.component';
import {FeAgentRegistrationFormCreateComponent} from './fe-content-management/fe-agent-registration/fe-agent-registration-form/fe-agent-registration-form.component';
import {PermissionEnum} from '@app/core/variables/permission.enum';
import {PermissionGuard} from "@app/core/guard/permission.guard";


const routes: Routes = [
  {
    path: 'content-management',
    children: [
      {
        path: '',
        component: FeContentManagementComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'terms-and-condition',
        component: FeTermsConditionComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'terms-and-condition/new',
        component: FeTermsConditionFormComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'terms-and-condition/:id',
        component: FeTermsConditionFormComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'ndid',
        component: FeNdidComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'ndid/new',
        component: FeNdidFormComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'ndid/:id',
        component: FeNdidFormComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'information',
        component: FeInformationComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'faqs/new',
        component: FeFaqsFormComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'faqs/:id',
        component: FeFaqsFormComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'pdpa',
        component: FePDPAComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'pdpa/new',
        component: FePDPAFormCreateComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'pdpa/:id',
        component: FePDPAFormCreateComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'general-file',
        component: FeGeneralFileListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'general-file/new',
        component: FeGeneralFileFormModalComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'general-file/id',
        component: FeGeneralFileFormModalComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'contact-us',
        component: FeGeneralContactUsFormCreateComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'contact-us/:id',
        component: FeGeneralContactUsFormCreateComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'announcement-list',
        component: FeGeneralAnnouncementComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'announcement/new',
        component: FeGeneralAnnouncementFormCreateComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'announcement/:id',
        component: FeGeneralAnnouncementFormCreateComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'announcement/detail/:id',
        component: FeGeneralAnnouncementDetailComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'about-us',
        component: FeAboutUsFormCreateComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'about-us/:id',
        component: FeAboutUsFormCreateComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      }, {
        path: 'agent-registration',
        component: FeAgentRegistrationFormCreateComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
      {
        path: 'agent-registration/:id',
        component: FeAgentRegistrationFormCreateComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionEnum.Content]
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule {
}
