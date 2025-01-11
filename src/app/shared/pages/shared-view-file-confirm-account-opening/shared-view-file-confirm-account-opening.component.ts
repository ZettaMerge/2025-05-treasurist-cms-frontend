import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '@postnerd-core';
import * as _ from 'lodash';
import { NgxSpinnerService } from "ngx-spinner";
import { AccountService } from "@api";

@Component({
  selector: 'shared-view-file-confirm-account-opening',
  templateUrl: './shared-view-file-confirm-account-opening.component.html',
  styleUrls: ['./shared-view-file-confirm-account-opening.component.scss']
})
export class SharedViewFileConfirmAccountOpeningComponent implements OnInit {
  @ViewChild('detailfileModal') detailfileModal: ModalComponent;
  @Input() data: any;
  @Input() account: boolean;
  @Input() customer: boolean;

  mode: string;
  fileType: string;
  accountFile: any;
  fileData: any = [
    { fileName: 'Bank Account', type: 'bankAcc', typeForAccountFile: 'BankAccount' },
    { fileName: 'Application Form', type: 'app', typeForAccountFile: 'ApplicationForm' },
    { fileName: 'ID Card/Passport/Juristic Document', type: 'idCard', typeForAccountFile: 'IdCardFront' },
    { fileName: 'Suitability Form', type: 'suitability', typeForAccountFile: 'Suitability' },
    { fileName: 'FATCA Form', type: 'fatca', typeForAccountFile: 'Fatca' },
    { fileName: 'Others', type: 'other', typeForAccountFile: 'Others' },
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
  ) {
  }

  ngOnInit(): void {

    this.checkAccFile();
  }

  checkAccFile() {

    // BankAccount
    this.accountService.accountFileGet$(this.data.id, 'BankAccount').subscribe(data => {
      console.log('data file iss 12333', data);
      console.log('data isEmpty', _.isEmpty(data));

      if (_.isEmpty(data)) {
        const finIndexAcc = _.findIndex(this.fileData, (item) => item.typeForAccountFile === 'BankAccount')
        this.fileData[finIndexAcc].isNoHaveFile = true;
      }

      console.log('fileData...', this.fileData)

    });
  }

  getOpenAccountFile() {
    this.spinner.show('global');
    this.accountService.accountFileGet$(this.data.userId, this.fileType).subscribe(data => {
      console.log('data file iss.....', data);
      this.accountFile = data;
      this.spinner.hide('global');
      this.detailfileModal.open();

    });
  }

  getOpenCusTomerFile() {
    this.spinner.show('global');
    this.accountService.accountFileGet$(this.data.id, this.fileType).subscribe(data => {
      console.log('data file iss 12333', data);
      this.accountFile = data;
      this.spinner.hide('global');
      this.detailfileModal.open();
    });
  }

  onOpenFileDetailModal(mode, customerData) {

    if (this.customer) {
      this.fileType = mode.typeForAccountFile;
      this.mode = mode.fileName;
      this.getOpenCusTomerFile();
    } else if (this.account) {
      this.fileType = mode.typeForAccountFile;
      this.mode = mode.fileName;
      this.getOpenAccountFile();
    }
  }

}
