import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LibModule } from '@postnerd-core';
import { windowToken, getWindow } from './window';
import { InnerHtmlComponent } from './components/inner-html/inner-html.component';

// BASE COMPONENTS
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarMenuComponent } from './sidebar/sidebar-menu.component';

// COMPONENTS
import { AutocompleteModule } from './components/autocomplete/autocomplete.module';
import { SharedDatatableWithNameComponent } from './components/shared-datatable-with-name/shared-datatable-with-name.component';
import { SharedDatatableStatusComponent } from './components/shared-datatable-status/shared-datatable-status.component';
import { SharedDatatableTransactionDateComponent } from './components/shared-datatable-transaction-date/shared-datatable-transaction-date.component';
import { EditorComponent } from './components/editor/editor.component';

// DIRECTIVES
import { ToggleFullscreenDirective } from './directives/toggle-fullscreen.directive';
import { SidebarLinkDirective } from './directives/sidebar-link.directive';
import { SidebarDropdownDirective } from './directives/sidebar-dropdown.directive';
import { SidebarAnchorToggleDirective } from './directives/sidebar-anchor-toggle.directive';
import { SidebarDirective } from './directives/sidebar.directive';
import { TopMenuDirective } from './directives/topmenu.directive';
import { TopMenuLinkDirective } from './directives/topmenu-link.directive';
import { TopMenuDropdownDirective } from './directives/topmenu-dropdown.directive';
import { TopMenuAnchorToggleDirective } from './directives/topmenu-anchor-toggle.directive';
import { SharedDatatablePortComponent } from './components/shared-datatable-port/shared-datatable-port.component';

// Pages

import { SharedViewPersonalInfoComponent } from './pages/shared-view-personal-info/shared-view-personal-info.component';
import { SharedAddressComponent } from '@shared/pages/shared-address/shared-address.component';
import { SharedViewCareerComponent } from './pages/shared-view-career/shared-view-career.component';
import { SharedViewIncomeComponent } from './pages/shared-view-income/shared-view-income.component';
import { SharedViewContactInformationComponent } from './pages/shared-view-contact-information/shared-view-contact-information.component';
import { SharedViewFileConfirmAccountOpeningComponent } from './pages/shared-view-file-confirm-account-opening/shared-view-file-confirm-account-opening.component';
import { SharedViewFileConfirmEditComponent } from './pages/shared-view-file-confirm-edit/shared-view-file-confirm-edit.component';
import { SharedViewCustomerAccountInfoComponent } from './pages/shared-view-customer-account-info/shared-view-customer-account-info.component';
import { SharedViewLegalEntityAccountInfoComponent } from './pages/shared-view-legal-entity-account-info/shared-view-legal-entity-account-info.component';
import { SharedViewLegalEntityAccountAddressComponent } from './pages/shared-view-legal-entity-account-address/shared-view-legal-entity-account-address.component';
import { SharedViewLegalEntityAccountBenefitInfoComponent } from './pages/shared-view-legal-entity-account-benefit-info/shared-view-legal-entity-account-benefit-info.component';
import { SharedViewLegalEntityAccountTermsSignTransactionComponent } from './pages/shared-view-legal-entity-account-terms-sign-transaction/shared-view-legal-entity-account-terms-sign-transaction.component';
import { SharedViewLegalEntityAccountListJuristicPersonComponent } from './pages/shared-view-legal-entity-account-list-juristic-person/shared-view-legal-entity-account-list-juristic-person.component';
import { SharedViewConfirmImageStatusComponent } from './pages/shared-view-confirm-image-status/shared-view-confirm-image-status.component';
import { SharedViewSuitabiliyCddComponent } from './pages/shared-view-suitabiliy-cdd/shared-view-suitabiliy-cdd.component';
import { SharedViewTransactionInfoComponent } from './pages/shared-view-transaction-info/shared-view-transaction-info.component';


// DROPDOWN
import { SharedProvinceDropdownComponent } from './dropdown/shared-province-dropdown.component';
import { SharedViewLegalAccountAddressByPhoneComponent } from './pages/shared-view-legal-account-address-by-phone/shared-view-legal-account-address-by-phone.component';
import { SharedViewPopupDetailCriminalRecordComponent } from './pages/shared-view-confirm-image-status/shared-view-popup-detail-criminal-record/shared-view-popup-detail-criminal-record.component';
import { SharedViewPopupDetailAmericanCitizenComponent } from './pages/shared-view-confirm-image-status/shared-view-popup-detail-american-citizen/shared-view-popup-detail-american-citizen.component';
import { SharedViewPopupDetailRiskComponent } from './pages/shared-view-suitabiliy-cdd/shared-view-popup-detail-risk/shared-view-popup-detail-risk.component';
import { SharedViewPopupDetailCddComponent } from './pages/shared-view-suitabiliy-cdd/shared-view-popup-detail-cdd/shared-view-popup-detail-cdd.component';
import { SharedViewPopupDetailFileAccountOpeningComponent } from './pages/shared-view-file-confirm-account-opening/shared-view-popup-detail-file-account-opening/shared-view-popup-detail-file-account-opening.component';
import { SharedViewAccountInfoComponent } from './pages/shared-view-account-info/shared-view-account-info.component';
import { SharedViewAccountFormPasswordComponent } from './pages/shared-view-account-info/shared-view-account-form-password/shared-view-account-form-password.component';
import { SharedViewAccountFormEmailComponent } from './pages/shared-view-account-info/shared-view-account-form-email/shared-view-account-form-email.component';
import { SharedViewAccountFormPincodeComponent } from './pages/shared-view-account-info/shared-view-account-form-pincode/shared-view-account-form-pincode.component';
import { SharedModalDeleteComponent } from './pages/shared-modal-delete/shared-modal-delete.component';
import { SharedAssetDropdownComponent } from '@shared/dropdown/shared-asset-dropdown.component';
import { SharedFundDropdownComponent } from '@shared/dropdown/shared-fund-dropdown.component';
import { SharedNdidVersionDropdownComponent } from '@shared/dropdown/shared-ndid-version-dropdown.component';
import { SharedTermsConditionVersionDropdownComponent } from '@shared/dropdown/shared-terms-condition-version-dropdown.component';
import { SharedPdpaVersionDropdownComponent } from '@shared/dropdown/shared-pdpa-version-dropdown.component';
import { SharedBusinessDropdownComponent } from '@shared/dropdown/shared-business-dropdown.component';
import { SharedCountryDropdownComponent } from '@shared/dropdown/shared-country-dropdown.component';
import { SharedMonthIncomeDropdownComponent } from '@shared/dropdown/shared-month-income-dropdown.component';
import { SharedNationalityDropdownComponent } from '@shared/dropdown/shared-nationality-dropdown.component';
import { SharedOccupationDropdownComponent } from '@shared/dropdown/shared-occupation-dropdown.component';
import { SharedAddressDropdownComponent } from '@shared/dropdown/shared-address-dropdown.component';
import { SharedSubDistrictDropdownComponent } from '@shared/dropdown/shared-sub-district-dropdown.component';
import { SharedProstalCodeDropdownComponent } from '@shared/dropdown/shared-prostal-code-dropdown.component';
import { SharedDistrictDropdownComponent } from '@shared/dropdown/shared-district-dropdown.component';
import { SharedBankBranchDropdownComponent } from '@shared/dropdown/shared-bank-branch-dropdown.component';
import { SharedBankDropdownComponent } from '@shared/dropdown/shared-bank-dropdown.component';
import { NgxMaskModule } from 'ngx-mask';
import { SharedDatatableWithNameFundComponent } from './components/shared-datatable-with-name-fund/shared-datatable-with-name-fund.component';
import { SharedStatusDropdownComponent } from './dropdown/shared-status-dropdown.component';
import { SharedOrderTypeDropdownComponent } from './dropdown/shared-order-type-dropdown.component';
import { SharedPaymentTypeDropdownComponent } from './dropdown/shared-payment-type-dropdown.component';
import { SharedFileCategoriesDropdownComponent } from './dropdown/shared-file-categories-dropdown.component';
import { SharedFileTypeDropdownComponent } from './dropdown/shared-file-type-dropdown.component';
import { SharedAimcDropdownComponent } from '@shared/dropdown/shared-aimc-dropdown.component';
import { SharedAssetTypeDropdownComponent } from '@shared/dropdown/shared-asset-type-dropdown.component';
import { SharedViewTransactionBuyComponent } from './pages/shared-view-transaction-info/shared-view-transaction-buy/shared-view-transaction-buy.component';
import { SharedViewTransactionSellComponent } from './pages/shared-view-transaction-info/shared-view-transaction-sell/shared-view-transaction-sell.component';
import { SharedViewTransactionSwitchComponent } from './pages/shared-view-transaction-info/shared-view-transaction-switch/shared-view-transaction-switch.component';
import { SharedCustomerDropdownComponent } from './dropdown/shared-customer-dropdown.component';
import {SharedAssetFormFundMappingDropdownComponent} from '@shared/dropdown/shared-asset-form-fund-mapping-dropdown.component';
import {SharedTeamDropdownComponent} from '@shared/dropdown/shared-team-dropdown.component';
import {SharedIcLicenseDropdownComponent} from '@shared/dropdown/shared-ic-license-dropdown.component';
import {SharedIcLicenseWithTeamDropdownComponent} from "@shared/dropdown/shared-ic-license-with-team-dropdown.component";
import { DatatableImageWithTitleComponent } from '@shared/components/datatable-image-with-title/datatable-image-with-title.component';
import { SharedFundWithoutFundMappingDropdownComponent } from '@shared/dropdown/shared-fund-without-fund-mapping-dropdown.component';
import { SharedAssetWithoutFundMappingDropdownComponent } from './dropdown/shared-asset-without-fund-mapping-dropdown.component';

@NgModule({
  declarations: [
    // Base Component
    NavbarComponent,
    SidebarMenuComponent,
    // Directive
    ToggleFullscreenDirective,
    SidebarLinkDirective,
    SidebarDropdownDirective,
    SidebarAnchorToggleDirective,
    SidebarDirective,
    TopMenuLinkDirective,
    TopMenuDropdownDirective,
    TopMenuAnchorToggleDirective,
    TopMenuDirective,
    // Component
    SharedDatatableWithNameComponent,
    SharedDatatablePortComponent,
    SharedDatatableStatusComponent,
    SharedDatatableTransactionDateComponent,
    EditorComponent,
    InnerHtmlComponent,
    // Dropdown
    SharedProvinceDropdownComponent,
    SharedAssetDropdownComponent,
    SharedFundDropdownComponent,
    SharedNdidVersionDropdownComponent,
    SharedTermsConditionVersionDropdownComponent,
    SharedPdpaVersionDropdownComponent,
    SharedBusinessDropdownComponent,
    SharedCountryDropdownComponent,
    SharedMonthIncomeDropdownComponent,
    SharedNationalityDropdownComponent,
    SharedOccupationDropdownComponent,
    SharedAddressDropdownComponent,
    SharedSubDistrictDropdownComponent,
    SharedProvinceDropdownComponent,
    SharedProstalCodeDropdownComponent,
    SharedDistrictDropdownComponent,
    SharedBankBranchDropdownComponent,
    SharedBankDropdownComponent,
    SharedStatusDropdownComponent,
    SharedOrderTypeDropdownComponent,
    SharedPaymentTypeDropdownComponent,
    SharedFileCategoriesDropdownComponent,
    SharedFileTypeDropdownComponent,
    SharedAimcDropdownComponent,
    SharedAssetTypeDropdownComponent,
    SharedCustomerDropdownComponent,
    SharedAssetFormFundMappingDropdownComponent,
    SharedTeamDropdownComponent,
    SharedIcLicenseDropdownComponent,
    SharedIcLicenseWithTeamDropdownComponent,
    SharedFundWithoutFundMappingDropdownComponent,
    SharedAssetWithoutFundMappingDropdownComponent,
    // Pages
    SharedAddressComponent,
    SharedViewPersonalInfoComponent,
    SharedViewCareerComponent,
    SharedViewIncomeComponent,
    SharedViewContactInformationComponent,
    SharedViewFileConfirmAccountOpeningComponent,
    SharedViewFileConfirmEditComponent,
    SharedViewCustomerAccountInfoComponent,
    SharedViewLegalEntityAccountInfoComponent,
    SharedViewLegalEntityAccountAddressComponent,
    SharedViewLegalEntityAccountBenefitInfoComponent,
    SharedViewLegalEntityAccountTermsSignTransactionComponent,
    SharedViewLegalEntityAccountListJuristicPersonComponent,
    SharedViewTransactionInfoComponent,
    SharedViewLegalAccountAddressByPhoneComponent,
    SharedViewConfirmImageStatusComponent,
    SharedViewSuitabiliyCddComponent,
    SharedViewPopupDetailCriminalRecordComponent,
    SharedViewPopupDetailAmericanCitizenComponent,
    SharedViewPopupDetailRiskComponent,
    SharedViewPopupDetailCddComponent,
    SharedViewPopupDetailFileAccountOpeningComponent,
    SharedViewAccountInfoComponent,
    SharedViewAccountFormPasswordComponent,
    SharedViewAccountFormEmailComponent,
    SharedViewAccountFormPincodeComponent,
    SharedModalDeleteComponent,
    SharedDatatableWithNameFundComponent,
    SharedViewTransactionBuyComponent,
    SharedViewTransactionSellComponent,
    SharedViewTransactionSwitchComponent,
    DatatableImageWithTitleComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    FormsModule,
    OverlayModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    ClickOutsideModule,
    AutocompleteModule,
    LibModule,
    NgxFileDropModule,
    AngularEditorModule,
    NgxMaskModule.forRoot(),
  ],
  exports: [
    CommonModule,
    LibModule,
    NavbarComponent,
    SidebarMenuComponent,
    ToggleFullscreenDirective,
    SidebarDirective,
    TopMenuDirective,
    NgbModule,
    FormsModule,
    NgxFileDropModule,
    ReactiveFormsModule,
    AngularEditorModule,
    NgxMaskModule,


    // Components
    SharedDatatableWithNameComponent,
    SharedDatatablePortComponent,
    SharedDatatableStatusComponent,
    SharedDatatableTransactionDateComponent,
    EditorComponent,
    InnerHtmlComponent,

    // Dropdown
    SharedProvinceDropdownComponent,
    SharedAssetDropdownComponent,
    SharedFundDropdownComponent,
    SharedNdidVersionDropdownComponent,
    SharedTermsConditionVersionDropdownComponent,
    SharedPdpaVersionDropdownComponent,
    SharedBusinessDropdownComponent,
    SharedCountryDropdownComponent,
    SharedMonthIncomeDropdownComponent,
    SharedNationalityDropdownComponent,
    SharedOccupationDropdownComponent,
    SharedAddressDropdownComponent,
    SharedSubDistrictDropdownComponent,
    SharedProvinceDropdownComponent,
    SharedProstalCodeDropdownComponent,
    SharedDistrictDropdownComponent,
    SharedBankBranchDropdownComponent,
    SharedBankDropdownComponent,
    SharedStatusDropdownComponent,
    SharedOrderTypeDropdownComponent,
    SharedPaymentTypeDropdownComponent,
    SharedFileCategoriesDropdownComponent,
    SharedFileTypeDropdownComponent,
    SharedAimcDropdownComponent,
    SharedAssetTypeDropdownComponent,
    SharedCustomerDropdownComponent,
    SharedAssetFormFundMappingDropdownComponent,
    SharedTeamDropdownComponent,
    SharedIcLicenseDropdownComponent,
    SharedIcLicenseWithTeamDropdownComponent,
    SharedFundWithoutFundMappingDropdownComponent,
    SharedAssetWithoutFundMappingDropdownComponent,

    // Pages
    SharedAddressComponent,
    SharedViewPersonalInfoComponent,
    SharedViewIncomeComponent,
    SharedViewCareerComponent,
    SharedViewContactInformationComponent,
    SharedViewFileConfirmAccountOpeningComponent,
    SharedViewFileConfirmEditComponent,
    SharedViewCustomerAccountInfoComponent,
    SharedViewLegalEntityAccountInfoComponent,
    SharedViewLegalEntityAccountAddressComponent,
    SharedViewLegalEntityAccountBenefitInfoComponent,
    SharedViewLegalEntityAccountTermsSignTransactionComponent,
    SharedViewLegalEntityAccountListJuristicPersonComponent,
    SharedViewTransactionInfoComponent,
    SharedViewLegalAccountAddressByPhoneComponent,
    SharedViewConfirmImageStatusComponent,
    SharedViewSuitabiliyCddComponent,
    SharedViewPopupDetailCriminalRecordComponent,
    SharedViewPopupDetailAmericanCitizenComponent,
    SharedViewPopupDetailRiskComponent,
    SharedViewAccountInfoComponent,
    SharedViewAccountFormPasswordComponent,
    SharedViewAccountFormEmailComponent,
    SharedViewAccountFormPincodeComponent,
    SharedModalDeleteComponent,
    SharedDatatableWithNameFundComponent,
    SharedViewTransactionBuyComponent,
    DatatableImageWithTitleComponent,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        { provide: windowToken, useFactory: getWindow },
      ],
    };
  }
}
