import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//
import { SortablejsModule } from 'ngx-sortablejs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxFileDropModule } from 'ngx-file-drop';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thLocale } from 'ngx-bootstrap/locale';

import { DurationFormatPipe } from './pipes/duration-format.pipe';
import { ExcludePipe } from './pipes/exclude.pipe';
import { ReadablePipe } from './pipes/readable.pipe';

import { AbsPipe } from './pipes/format/abs.pipe';
import { DatePipe } from './pipes/format/date.pipe';
import { DateTimePipe } from './pipes/format/dateTime.pipe';
import { DecimalPipe } from './pipes/format/decimal.pipe';
import { IntegerPipe } from './pipes/format/integer.pipe';
import { TimePipe } from './pipes/format/time.pipe';
import { DateYearPipe } from './pipes/format/dateYear.pipe';


import { ErrorMessageBuilderDirective } from './validators/error-message-builder.directive';
import { ErrorMessageControlComponent } from './validators/error-message-control.component';
import { EmailValidatorDirective } from './validators/email.directive';
import { EqualToValidatorDirective } from './validators/equal-to.directive';
import { MinMaxValidatorDirective } from './validators/min-max-validator.directive';
import { StringValidatorDirective } from './validators/string-validator.directive';
import { LinkDirective } from './validators/link.directive';
import { PassWordValidatorDirective } from './validators/password.directive';

import { BDateTimePipe } from './pipes/format/bDateTime.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { FullAddressPipe } from './pipes/format/full-address.pipe';

import { ImageFallbackDirective } from './directives/image-fallback.directive';
import { OnlyPositiveDirective } from './directives/only-positive.directive';

import { PnGridComponent } from './components/grid/pn-grid.component';
import { PnGridHeaderWrapperComponent } from './components/grid/grid-header-wrapper/pn-grid-header-wrapper.component';
import { ModalComponent, ModalTitleComponent, ModalFooterComponent } from './components/modal/modal.component';
import { windowToken, getWindow } from './components/modal/window';
import { PopupComponent } from './components/popup/popup.component';
import { userPopupConfigToken } from './components/popup/user-config.token';
import { PopupService } from './components/popup/popup.service';
import { DialogService } from './components/popup/dialog.service';
import { PopupConfig } from './components/popup/popup.config';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { InnerHtmlComponent } from './components/inner-html/inner-html.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { TimeRangePickerComponent } from './components/time-range-picker/time-range-picker.component';
import { ToggleComponent, ToggleLeftComponent, ToggleRightComponent } from './components/toggle/toggle.component';
import { FileInputComponent } from './components/file-input/file-input.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { PerPageDropdownComponent } from './components/dropdown/per-page-dropdown.component';
import { DynamicDropdownComponent } from './components/dropdown/dynamic-dropdown.component';
import { GridPerPageComponent } from './components/grid/grid-per-page/grid-per-page.component';
import { LoadingComponent } from './components/loading/loading.component';
import { FileImageInputComponent } from './components/file-image-input/file-image-input.component';
import { SegmentedControlComponent } from './components/segmented-control/segmented-control.component';
import { DataNotFoundComponent } from './components/data-not-found/data-not-found.component';
import { TabsComponent } from './components/tabs/tabs.component';




defineLocale('th', thLocale);

@NgModule({
  declarations: [
    // validators
    ErrorMessageBuilderDirective,
    ErrorMessageControlComponent,
    EmailValidatorDirective,
    EqualToValidatorDirective,
    MinMaxValidatorDirective,
    StringValidatorDirective,
    LinkDirective,
    PassWordValidatorDirective,

    // pipes
    DurationFormatPipe,
    ExcludePipe,
    ReadablePipe,
    SafePipe,
    SearchPipe,
    FilterPipe,
    FullAddressPipe,

    // pipes format
    AbsPipe,
    DatePipe,
    DateTimePipe,
    DecimalPipe,
    IntegerPipe,
    TimePipe,
    BDateTimePipe,
    DateYearPipe,

    // Directives
    ImageFallbackDirective,
    OnlyPositiveDirective,

    // components
    PnGridComponent,
    PnGridHeaderWrapperComponent,
    ModalComponent,
    ModalTitleComponent,
    ModalFooterComponent,
    PopupComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    InnerHtmlComponent,
    TimePickerComponent,
    TimeRangePickerComponent,
    ToggleComponent,
    ToggleLeftComponent,
    ToggleRightComponent,
    FileInputComponent,
    FileImageInputComponent,
    DropdownComponent,
    PerPageDropdownComponent,
    DynamicDropdownComponent,
    GridPerPageComponent,
    LoadingComponent,
    SegmentedControlComponent,
    DataNotFoundComponent,
    TabsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SortablejsModule.forRoot({ animation: 150 }),
    NgxDatatableModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    NgxFileDropModule,
    NgbTooltipModule,
    NgxSpinnerModule,
    NgxDatatableModule,
    NgxDatatableModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,

    // LIB
    BsDatepickerModule,
    NgxFileDropModule,
    NgxSpinnerModule,
    NgSelectModule,

    // validators
    ErrorMessageBuilderDirective,
    ErrorMessageControlComponent,
    EmailValidatorDirective,
    EqualToValidatorDirective,
    MinMaxValidatorDirective,
    StringValidatorDirective,
    LinkDirective,
    PassWordValidatorDirective,

    // pipes
    DurationFormatPipe,
    ExcludePipe,
    ReadablePipe,
    SafePipe,
    SearchPipe,
    FilterPipe,
    FullAddressPipe,

    // pipes format
    AbsPipe,
    DatePipe,
    DateTimePipe,
    DecimalPipe,
    IntegerPipe,
    TimePipe,
    BDateTimePipe,
    DateYearPipe,

    // Directives
    ImageFallbackDirective,
    OnlyPositiveDirective,

    // components
    PnGridComponent,
    PnGridHeaderWrapperComponent,
    ModalComponent,
    ModalTitleComponent,
    ModalFooterComponent,
    PopupComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    InnerHtmlComponent,
    TimePickerComponent,
    TimeRangePickerComponent,
    ToggleComponent,
    ToggleLeftComponent,
    ToggleRightComponent,
    FileInputComponent,
    FileImageInputComponent,
    DropdownComponent,
    PerPageDropdownComponent,
    DynamicDropdownComponent,
    GridPerPageComponent,
    LoadingComponent,
    SegmentedControlComponent,
    DataNotFoundComponent,
    TabsComponent,
  ],
})
export class LibModule {
  static forRoot(
    config?: PopupConfig,
  ): ModuleWithProviders<LibModule> {
    return {
      ngModule: LibModule,
      providers: [
        AbsPipe,
        { provide: windowToken, useFactory: getWindow },
        { provide: userPopupConfigToken, useValue: config },
        PopupService,
        DialogService,
      ],

    };
  }
}
