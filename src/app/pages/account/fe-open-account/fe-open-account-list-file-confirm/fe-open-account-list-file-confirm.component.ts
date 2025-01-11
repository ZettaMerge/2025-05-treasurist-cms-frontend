import {Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {ModalComponent} from '@postnerd-core';
import {AccountService} from '@api';
import * as _ from 'lodash';

@Component({
  selector: 'fe-open-account-list-file-confirm',
  templateUrl: './fe-open-account-list-file-confirm.component.html',
  styleUrls: ['./fe-open-account-list-file-confirm.component.scss']
})
export class FeOpenAccountListFileConfirmComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() userId: number;
  @Input() isBankAccountFile: boolean;
  @Input() isApplicationFormFile: boolean;
  @Input() isIdCardFrontFile: boolean;
  @Input() isSuitabilityFile: boolean;
  @Input() isFatcaFile: boolean;
  @Input() isOthersFile: boolean;
  @Output() updateFile = new EventEmitter();

  @ViewChild('uploadModal') modal: ModalComponent;
  listFile = [
    {
      fileName: 'Bank Account',
      value: 'BankAccount',
      validate: false,
      validateText: 'กรุณา Upload File Bank Account ให้ครบถ้วน',
      isHaveData: false
    },
    {
      fileName: 'Application Form',
      value: 'ApplicationForm',
      validate: false,
      validateText: 'กรุณา Upload File Application Form ให้ครบถ้วน',
      isHaveData: false
    },
    {
      fileName: 'ID Card/Passport/Juristic Document',
      value: 'IdCardFront',
      validate: false,
      validateText: 'กรุณา Upload File ID Card/Passport/Juristic Document ให้ครบถ้วน',
      isHaveData: false
    },
    {
      fileName: 'Suitability Form',
      value: 'Suitability',
      validate: false,
      validateText: 'กรุณา Upload File Suitability Form ให้ครบถ้วน',
      isHaveData: false
    },
    {
      fileName: 'FATCA Form',
      value: 'Fatca',
      validate: false,
      validateText: 'กรุณา Upload File FATCA Form ให้ครบถ้วน',
      isHaveData: false
    },
    {
      fileName: 'Others',
      value: 'Others',
      validate: false,
      validateText: 'กรุณา Upload File Others ให้ครบถ้วน',
      isHaveData: false
    },
  ];

  // , , , , IdCardFront, IdCardBack, , Signature)
  mode: string;

  // userId: number;

  constructor(
    private accountService: AccountService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('userId', this.userId);
    if (this.userId) {
      console.log('data userId', this.data.userId);
      this.getFileData();
    }

    if (this.isBankAccountFile) {
      this.listFile[0].validate = true;
    }

    if (this.isApplicationFormFile) {
      this.listFile[1].validate = true;
    }

    if (this.isIdCardFrontFile) {
      this.listFile[2].validate = true;
    }

    if (this.isSuitabilityFile) {
      console.log('suit fact');
      this.listFile[3].validate = true;
    }

    if (this.isFatcaFile) {
      console.log('filee fact');
      this.listFile[4].validate = true;
    }

    if (this.isOthersFile) {
      this.listFile[5].validate = true;
    }
  }

  ngOnInit(): void {

  }

  getFileData() {
    console.log('(this.data.userId', this.data.userId);

    for (const file of this.listFile) {
      this.accountService.accountFileGet$(this.userId, file.value).subscribe(data => {
        console.log('data', data);
        if (_.isEmpty(data)) {
          file.isHaveData = false;
        } else {
          file.isHaveData = true;
          file.validate = false;
        }
      });
    }

    //  this.accountService.accountFileGet$(this.userId, file.value).subscribe(data => {
    // }
    // // this.accountService.accountFileGet$(this.userId, this.mode).subscribe(data => {
    // //   console.log('data', data);
    // //   this.accountFileData = data;
    // //   if (!_.isEmpty(this.accountFileData)) {
    // //     console.log('=!= []');
    // //     this.isShow = false;
    // //     this.isShowHistory = true;
    // //   } else if (_.isEmpty(this.accountFileData)) {
    // //     console.log('=== []');
    // //     this.isShow = true;
    // //     this.isShowHistory = false;
    // //   }
    // //   this.spinner.hide('global');
    // // });
  }

  onOpenModal(mode: string, userId) {
    this.mode = mode;
    this.userId = userId;
    console.log('this.mode', this.mode);
    console.log('this.userId', this.userId);
    this.modal.open();
  }

  onUpdateFile(event) {
    this.modal.close();
    this.updateFile.emit(this.mode);
  }
}
