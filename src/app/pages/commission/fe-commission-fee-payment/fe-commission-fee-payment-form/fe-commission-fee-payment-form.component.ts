import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {turn} from 'core-js/core/array';
import {NgxSpinnerService} from 'ngx-spinner';
import {CheckPermissionService, CommissionFeeService} from '@api';
import * as _ from 'lodash';
import {PaymentTermDTO} from '@model';
import * as moment from 'moment';
import {FileSaverService} from "ngx-filesaver";
import {ToastrService} from "ngx-toastr";
import {PnStorageService} from "@postnerd-core";
import {PermissionEnum} from "@app/core/variables/permission.enum";


@Component({
  selector: 'fe-commission-fee-payment-form',
  templateUrl: './fe-commission-fee-payment-form.component.html',
  styleUrls: ['./fe-commission-fee-payment-form.component.scss']
})
export class FeCommissionFeePaymentFormComponent implements OnInit {

  paymentData: PaymentTermDTO = {} as PaymentTermDTO;
  paymentId: any;
  summaryId: any;
  fileType: string;

  canView: boolean;
  canCreate: boolean;
  canExport: boolean;

  isCommissionPage = true;

  fileFrontEndCoverPreview = null;
  fileFrontEndCoverFile = null;

  fileTrailingCoverPreview = null;
  fileTrailingCoverFile = null;

  filePromotionCoverPreview = null;
  filePromotionCoverFile = null;

  fileNewCoverPreview = null;
  fileNewCoverFile = null;

  isErrorFrontEnd = false;
  isErrorTrailing = false;
  isErrorPromotion = false;
  isErrorNewFile = false;
  isExportPort = false;

  isDisableButtonImport = false;
  isDisableSummaryButton = true;
  isDisableButton = true;
  isDisableNewFileButton = true;
  isDisableUpdateButton = true;
  isShowSummaryCommission = false;
  isDisableCustomUploadCommission = false;
  isDisableCustomUpdateCommission = false;


  isInvalidPaymentDate = false;
  isInvalidDescription = false;

  isValidImportTrailing = false;
  isValidImportFrontEnd = false;
  isValidCommissionSummary = false;
  isValidUpdateSummary = false;

  isDisableUpdateCommission = false;


  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private commissionFeeService: CommissionFeeService,
    private fileSaverService: FileSaverService,
    private toastrService: ToastrService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
  }

  ngOnInit(): void {

    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.CommissionPayment).then(result => {
      if (result) {
        this.canView = result.canView;
        this.canCreate = result.canCreate;
        this.canExport = result.canExport;
      }
      console.log('this.canView', this.canView);
      console.log('this.canCreate', this.canCreate);
      console.log('this.canExport', this.canExport);
    });

    this.paymentId = this.route.snapshot.paramMap.get('id');

    if (this.paymentId) {
      this.getDataPaymentById();
      this.isDisableButton = false;
    } else {
      this.isDisableCustomUploadCommission = false;
    }
  }

  onSaveDraft() {
    this.spinner.show('global');

    this.isValidImportTrailing = false;
    this.isValidImportFrontEnd = false;
    this.isValidCommissionSummary = false;
    this.isInvalidPaymentDate = false;
    this.isInvalidDescription = false;
    this.isValidUpdateSummary = false;

    if (!this.paymentData.paymentDate) {
      this.isInvalidPaymentDate = true;
    }

    if (!this.paymentData.description) {
      this.isInvalidDescription = true;
    }

    if (!this.fileTrailingCoverPreview) {
      this.isValidImportTrailing = true;
    }

    if (!this.fileFrontEndCoverPreview) {
      this.isValidImportFrontEnd = true;
    }

    if (this.fileNewCoverPreview && !this.isDisableUpdateButton) {
      this.isValidUpdateSummary = true;
    }


    if (this.fileTrailingCoverPreview && this.fileFrontEndCoverPreview && this.paymentId && !this.summaryId && !this.isDisableSummaryButton && !this.fileNewCoverPreview) {
      this.isValidCommissionSummary = true;
    }

    if (this.fileTrailingCoverPreview && this.fileFrontEndCoverPreview && !this.summaryId && !this.paymentId && !this.isDisableSummaryButton && !this.fileNewCoverPreview) {
      this.isValidCommissionSummary = true;
    }

    if (this.isValidImportTrailing || this.isValidImportFrontEnd || this.isValidCommissionSummary || this.isInvalidDescription || this.isInvalidPaymentDate || this.isValidUpdateSummary) {
      this.spinner.hide('global');
      return;
    } else {
      this.commissionFeeService.paymentTermsUpdateStatusPut$(
        _.toNumber(this.paymentId) || this.summaryId,
        this.paymentData?.description,
        this.paymentData?.paymentDate ? moment(this.paymentData?.paymentDate).format('YYYY-MM-DD') : undefined,
        'draft').subscribe(
        status => {
          console.log('data is save draft');
          this.spinner.hide('global');
          this.router.navigate([`./commission/payment`]);
        });
    }
  }

  onSave(form) {
    this.spinner.show('global');
    this.isValidImportTrailing = false;
    this.isValidImportFrontEnd = false;
    this.isValidCommissionSummary = false;
    this.isValidUpdateSummary = false;

    if (this.fileNewCoverPreview && !this.isDisableUpdateButton) {
      this.isValidUpdateSummary = true;
    }

    if (!this.fileTrailingCoverPreview) {
      this.isValidImportTrailing = true;
    }

    if (!this.fileFrontEndCoverPreview) {
      this.isValidImportFrontEnd = true;
    }

    if (this.fileTrailingCoverPreview && this.fileFrontEndCoverPreview && this.paymentId && !this.summaryId && !this.isDisableSummaryButton && !this.fileNewCoverPreview) {
      this.isValidCommissionSummary = true;
    }

    if (this.fileTrailingCoverPreview && this.fileFrontEndCoverPreview && !this.summaryId && !this.paymentId && !this.isDisableSummaryButton && !this.fileNewCoverPreview) {
      this.isValidCommissionSummary = true;
    }


    if (form.invalid || this.isValidImportTrailing || this.isValidImportFrontEnd || this.isValidCommissionSummary || this.isValidUpdateSummary) {
      this.spinner.hide('global');
      return;
    } else {
      this.commissionFeeService.paymentTermsUpdateStatusPut$(
        _.toNumber(this.paymentId) || this.summaryId,
        this.paymentData?.description,
        this.paymentData?.paymentDate ? moment(this.paymentData?.paymentDate).format('YYYY-MM-DD') : undefined,
        'published').subscribe(
        status => {
          console.log('data is save draft');
          this.spinner.hide('global');
          this.router.navigate([`./commission/payment`]);
        });
    }
  }

  goBack() {
    this.router.navigate([`./commission/payment`]);
  }

  getDataPaymentById() {
    this.spinner.show('global');

    this.commissionFeeService.paymentTermsIdGet$(_.toNumber(this.paymentId) || this.summaryId)
      .subscribe(data => {
        this.paymentData = data;
        this.fileFrontEndCoverPreview = data.feFeeFileName;
        this.fileTrailingCoverPreview = data.trFeeFileName;

        if (data.proFeeFileName) {
          this.filePromotionCoverPreview = data.proFeeFileName;
        }

        if (this.paymentId) {
          this.isDisableCustomUploadCommission = true;
        }

        console.log('this.filePromotionCoverPreview', this.filePromotionCoverPreview);
        this.spinner.hide('global');
      });
  }

  onDataChange(event, type) {
    if (type === 'date') {
      this.isInvalidPaymentDate = false;
    }

    if (type === 'description') {
      this.isInvalidDescription = false;
    }
  }

  onChangeFileFrontEnd(event) {
    console.log('event', event);
    this.isErrorFrontEnd = false;
    this.fileFrontEndCoverPreview = null;
    this.fileFrontEndCoverFile = null;
    this.isValidImportFrontEnd = false;
    this.isDisableCustomUploadCommission = false;
    console.log('onChangefile', event);
    const fileType = event.target.files[0].type;
    console.log('fileType', fileType);
    this.fileType = fileType;
    if (event.target && fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.fileFrontEndCoverFile = event.target.files[0];
      console.log('fileFrontEndCoverFile', this.fileFrontEndCoverFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        // this.fileCoverPreview = e.target.result;
        console.log(' this.fileFrontEndCoverPreview', e);
        this.fileFrontEndCoverPreview = event.target.files[0].name;
      };
      reader.readAsDataURL(this.fileFrontEndCoverFile);
    } else {
      this.isErrorFrontEnd = true;
    }


  }

  onChangeFileTrailing(event) {
    this.isErrorTrailing = false;
    this.fileTrailingCoverPreview = null;
    this.fileTrailingCoverFile = null;
    this.isValidImportTrailing = false;
    this.isDisableCustomUploadCommission = false;
    console.log('onChangeFileTrailing', event);
    const fileType = event.target.files[0].type;
    console.log('fileType', fileType);
    this.fileType = fileType;
    if (event.target && fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.fileTrailingCoverFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        // this.fileCoverPreview = e.target.result;
        console.log(' this.fileTrailingCoverPreview', e);
        this.fileTrailingCoverPreview = event.target.files[0].name;
      };
      reader.readAsDataURL(this.fileTrailingCoverFile);
    } else {
      this.isErrorTrailing = true;
    }
  }

  onChangeFilePromotion(event) {
    this.isErrorPromotion = false;
    this.filePromotionCoverPreview = null;
    this.filePromotionCoverFile = null;
    console.log('onChangeFilePromotion', event);
    const fileType = event.target.files[0].type;
    console.log('fileType', fileType);
    this.fileType = fileType;
    if (event.target && fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.filePromotionCoverFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        // this.fileCoverPreview = e.target.result;
        console.log(' this.filePromotionCoverPreviewt', e);
        this.filePromotionCoverPreview = event.target.files[0].name;
      };
      reader.readAsDataURL(this.filePromotionCoverFile);
    } else {
      this.isErrorPromotion = true;
    }
  }

  onChangeFileImportNew(event) {
    this.isErrorNewFile = false;
    this.fileNewCoverPreview = null;
    this.fileNewCoverFile = null;
    this.isDisableNewFileButton = false;
    this.isDisableUpdateButton = false;
    this.isDisableCustomUpdateCommission = false;

    const fileType = event.target.files[0].type;
    console.log('fileType', fileType);
    this.fileType = fileType;
    if (event.target && fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.fileNewCoverFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        // this.fileCoverPreview = e.target.result;
        console.log(' this.fileNewCoverPreview', e);
        this.fileNewCoverPreview = event.target.files[0].name;
        // this.onUpdateCommission();

      };
      reader.readAsDataURL(this.fileNewCoverFile);
    } else {
      this.isErrorNewFile = true;
    }
  }

  onSummaryCommission() {
    this.isDisableSummaryButton = true;
    this.isShowSummaryCommission = true;
    this.isDisableButton = false;
    this.isInvalidPaymentDate = false;
    this.isInvalidDescription = false;
    this.isValidCommissionSummary = false;
    this.isDisableCustomUploadCommission = false;
    this.spinner.show('global');

    console.log(`moment(this.paymentData?.paymentDate).format('YYYY-MM-DD')`, moment(this.paymentData?.paymentDate).format('YYYY-MM-DD'));
    console.log(`this.filePromotionCoverPreview`, this.filePromotionCoverPreview);
    console.log(`this.fileTrailingCoverPreview`, this.fileTrailingCoverPreview);
    console.log(`this.fileFrontEndCoverPreview`, this.fileFrontEndCoverPreview);
    console.log(`this.fileFrontEndCoverFile`, this.fileFrontEndCoverFile);

    if (!this.paymentData.paymentDate) {
      this.isInvalidPaymentDate = true;
      this.isDisableSummaryButton = false;
    }

    if (!this.paymentData.description) {
      this.isInvalidDescription = true;
      this.isDisableSummaryButton = false;
    }

    if (this.isInvalidPaymentDate || this.isInvalidDescription) {
      this.spinner.hide('global');
      return;
    } else {
      if (!this.paymentId) {
        this.commissionFeeService.paymentTermsPost$(
          this.fileFrontEndCoverFile,
          this.fileTrailingCoverFile,
          this.paymentData?.description,
          this.fileFrontEndCoverPreview,
          this.paymentData?.paymentDate ? moment(this.paymentData?.paymentDate).format('YYYY-MM-DD') : undefined,
          this.filePromotionCoverFile,
          this.filePromotionCoverPreview,
          this.paymentData?.status || null,
          this.fileTrailingCoverPreview,
        ).subscribe(data => {
          console.log('onsave', data);
          this.summaryId = data.id;
          this.isDisableButton = false;
          this.isDisableCustomUploadCommission = true;
          this.getDataPaymentById();
          this.spinner.hide('global');
        }, (error) => {
          if (error && error.error) {
            const errors = JSON.parse(error.error);
            this.isDisableButton = true;
            // this.toastrService.error(`${errors.errorMessage}`);
            this.toastrService.error(`ข้อมูลในไฟล์ไม่ถูกต้องกรุณาอัปโหลดไฟล์ใหม่`);
          }
        });
      } else {
        this.commissionFeeService.paymentTermsPut$(
          _.toNumber(this.paymentId),
          this.fileFrontEndCoverFile,
          this.fileTrailingCoverFile,
          this.paymentData?.description,
          this.fileFrontEndCoverPreview,
          this.paymentData?.paymentDate ? moment(this.paymentData?.paymentDate).format('YYYY-MM-DD') : undefined,
          this.filePromotionCoverFile,
          this.filePromotionCoverPreview,
          this.paymentData?.status || null,
          this.fileTrailingCoverPreview,
        ).subscribe(data => {
          console.log('onsave', data);
          this.summaryId = data.id;
          this.isDisableButton = false;
          this.isDisableCustomUploadCommission = true;
          this.getDataPaymentById();
          this.spinner.hide('global');
        }, (error) => {
          if (error && error.error) {
            const errors = JSON.parse(error.error);
            this.isDisableButton = true;
            this.toastrService.error(`ข้อมูลในไฟล์ไม่ถูกต้องกรุณาอัปโหลดไฟล์ใหม่`);
          }
        });
      }
    }
  }

  onCheckFile() {
    if (!this.paymentId && this.fileFrontEndCoverFile && this.fileTrailingCoverFile) {
      this.isDisableSummaryButton = false;
    } else if (this.paymentId && this.fileFrontEndCoverFile && this.fileTrailingCoverFile ||
      this.paymentId && this.fileFrontEndCoverPreview && this.fileTrailingCoverPreview ||
      this.paymentId && this.fileFrontEndCoverFile && this.fileTrailingCoverPreview ||
      this.paymentId && this.fileFrontEndCoverPreview && this.fileTrailingCoverFile
    ) {
      this.isDisableSummaryButton = false;
    } else {
      this.isDisableSummaryButton = true;
    }

    if (this.fileNewCoverFile) {
      this.isDisableUpdateButton = false;
    } else {
      this.isDisableUpdateButton = true;
    }
  }

  exportReport() {
    this.isExportPort = true;
    this.spinner.show('global');

    if (this.paymentData?.status !== 'published') {
      this.isDisableNewFileButton = false;
    }

    this.commissionFeeService.paymentTermsExportExcelCommissionFeeGet$(_.toNumber(this.paymentId) || this.summaryId).subscribe(
      res => {
        this.fileSaverService.save((res), `commission_report.xlsx`);
        this.spinner.hide('global');
      });
  }


  onUpdateCommission() {
    this.spinner.show('global');
    this.isValidUpdateSummary = false;
    this.isDisableUpdateButton = true;
    this.isDisableCustomUpdateCommission = false;

    this.commissionFeeService.paymentTermsImportExcelCommissionFeePut$(
      _.toNumber(this.paymentId) || this.summaryId,
      this.fileNewCoverFile,
    ).subscribe(data => {
      console.log('data', data);
      if (data) {
        this.summaryId = data.id;
        this.isDisableCustomUpdateCommission = true;
        this.getDataPaymentById();
        this.spinner.hide('global');

      }
    });
  }
}
