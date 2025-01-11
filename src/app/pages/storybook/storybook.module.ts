import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { StorybookRoutingModule } from './storybook-routing.module';
import { StorybookComponent } from './storybook.component';

import { VButtonComponent } from './v-button/v-button.component';
import { VInputComponent } from './v-input/v-input.component';
import { VRadioComponent } from './v-radio/v-radio.component';
import { VToggleComponent } from './v-toggle/v-toggle.component';
import { VCheckboxComponent } from './v-checkbox/v-checkbox.component';
import { VTypographyComponent } from './v-typography/v-typography.component';
import { VDatepickerComponent } from './v-datepicker/v-datepicker.component';
import { VTimepickerComponent } from './v-timepicker/v-timepicker.component';
import { VIconComponent } from './v-icon/v-icon.component';
import { VDataNotFoundComponent } from './v-data-not-found/v-data-not-found.component';
import { VSegmentedControlComponent } from './v-segmented-control/v-segmented-control.component';
import { VBadgeComponent } from './v-badge/v-badge.component';
import { VDropdownComponent } from './v-dropdown/v-dropdown.component';
import { VTabComponent } from './v-tab/v-tab.component';


@NgModule({
  declarations: [
    StorybookComponent,
    VButtonComponent,
    VInputComponent,
    VRadioComponent,
    VToggleComponent,
    VCheckboxComponent,
    VTypographyComponent,
    VDatepickerComponent,
    VTimepickerComponent,
    VIconComponent,
    VDataNotFoundComponent,
    VSegmentedControlComponent,
    VBadgeComponent,
    VDropdownComponent,
    VTabComponent
  ],
  imports: [
    SharedModule,
    StorybookRoutingModule
  ]
})
export class StorybookModule { }
