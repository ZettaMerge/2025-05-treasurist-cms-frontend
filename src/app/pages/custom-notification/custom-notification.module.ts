import { NgModule } from '@angular/core';
import { CustomNotificationRoutingModule } from './custom-notification-routing.module';
import { SharedModule } from '@shared/shared.module';
import { CustomNotificationFormComponent } from './custom-notification-form/custom-notification-form.component';
import { CustomNotificationListComponent } from './custom-notification-list/custom-notification-list.component';
import { CustomNotificationFormFileComponent } from './custom-notification-form/custom-notification-form-file/custom-notification-form-file.component';
import { CustomNotificationDetailComponent } from './custom-notification-detail/custom-notification-detail.component';
import { CustomNotificationCustomerFormComponent } from './custom-notification-form/custom-notification-customer-form/custom-notification-customer-form.component';
import { CustomNotificationAgentFormComponent } from './custom-notification-form/custom-notification-agent-form/custom-notification-agent-form.component';
import { CustomNotificationCustomerDetailComponent } from './custom-notification-detail/custom-notification-customer-detail/custom-notification-customer-detail.component';
import { CustomNotificationAgentDetailComponent } from './custom-notification-detail/custom-notification-agent-detail/custom-notification-agent-detail.component';


@NgModule({
  declarations: [
    CustomNotificationFormComponent,
    CustomNotificationListComponent,
    CustomNotificationFormFileComponent,
    CustomNotificationDetailComponent,
    CustomNotificationCustomerFormComponent,
    CustomNotificationAgentFormComponent,
    CustomNotificationCustomerDetailComponent,
    CustomNotificationAgentDetailComponent
  ],
    imports: [
        SharedModule,
        CustomNotificationRoutingModule,
    ]
})
export class CustomNotificationModule { }
