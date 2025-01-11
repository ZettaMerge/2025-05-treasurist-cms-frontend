import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseFeatureGridComponent, PopupService} from '@postnerd-core';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {AccountService} from '@api';
import {AccountFileDTO} from '@model';
import * as _ from 'lodash';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';
import {FileSaverService} from 'ngx-filesaver';

@Component({
  selector: 'fe-open-account-form-upload-file',
  templateUrl: './fe-open-account-form-upload-file.component.html',
  styleUrls: ['./fe-open-account-form-upload-file.component.scss']
})
export class FeOpenAccountFormUploadFileComponent implements OnInit {
  @Input() mode: string;
  @Input() userId: number;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  fileCoverPreview;
  fileCover;
  fileCoverFile;
  isShow: boolean;
  isShowHistory: boolean;
  filename: string;
  accountFileData: any;
  // AccountFileDTO

  // subscribe
  dataSub: Subscription;
  saveSub: Subscription;

  constructor(
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private popupService: PopupService,
    private toastrService: ToastrService,
    private fileSaverService: FileSaverService,
  ) {
  }

  ngOnInit(): void {
    if (this.userId) {
      this.getFileData();
    }
  }

  getFileData() {
    this.spinner.show('global');

    this.accountService.accountFileGet$(this.userId, this.mode).subscribe(data => {
      console.log('data', data);
      this.accountFileData = data;
      if (!_.isEmpty(this.accountFileData)) {
        console.log('=!= []');
        this.isShow = false;
        this.isShowHistory = true;
      } else if (_.isEmpty(this.accountFileData)) {
        console.log('=== []');
        this.isShow = true;
        this.isShowHistory = false;
      }
      this.spinner.hide('global');
    });
  }

  onCancelUpload() {

    if (!_.isEmpty(this.accountFileData)) {
      this.isShow = false;
      this.isShowHistory = true;
    } else {
      this.cancel.emit();
    }

  }

  onCancel() {
    this.cancel.emit();
  }

  onDownloadFile(file) {
    console.log('herllo', file);
    if (file) {
      this.spinner.show('global');
      this.accountService.accountDownloadFileGet$(file.id).subscribe( data => {
        console.log('res download', data);
        this.spinner.hide('global');
        this.fileSaverService.save(data, `${this.mode}.pdf`);
      });
    }
  }

  onDeleteFile(file) {
    const fileType = file.fileType;
    this.popupService.confirm(`${file.fileType}`, `คุณต้องการลบ ${file.fileType} เวอร์ชันอัพเดทเมื่อวันที่ ${moment(file.createdDate).format('DD/MM/YYYY HH:mm')} หรือไม่ ?`, `danger`)
      .subscribe((data) => {
        if (data) {
          this.spinner.show('global');
          this.accountService.accountFileDelete$(file.id).subscribe(data => {
            console.log('delete: ', data);
            this.getFileData();
            this.toastrService.success(`Delete ${fileType} successful.`);
            this.spinner.hide('global');
          });
        } else {
          this.spinner.hide('global');
        }
      });

  }

  onClickNewUpload() {
    this.isShowHistory = false;
    this.isShow = true;
  }

  onSelectFileCover(event) {
    console.log('onSelectFileCover', event);

    if (event.type !== 'application/pdf') {
      this.toastrService.error('ไฟล์ Upload ต้องเป็น .pdf เท่านั้น');
      this.fileCoverFile = undefined;
      this.fileCover = undefined;
    } else {
      this.fileCoverFile = event;
      const reader = new FileReader();
      reader.onload = e => {
        this.fileCoverPreview = e.target.result;
        console.log(' this.fileCoverPreview', this.fileCoverPreview);
      };
      reader.readAsDataURL(this.fileCoverFile);
      console.log(' this.fileCoverFile', this.fileCoverFile);
    }

  }

  removeImageCover() {
    this.fileCoverFile = null;
    this.fileCoverPreview = null;
  }

  onSubmit(form) {
    this.spinner.show('global');
    if (form.invalid || !this.fileCoverPreview) {
      this.spinner.hide('global');
      console.log('no data');
      return;
    } else if (this.fileCoverFile) {
      console.log('have data');

      this.accountService.accountUploadFilePost$(this.userId, this.fileCoverFile, this.mode).subscribe(
        data => {
          console.log('data', data);
          this.getFileData();
          this.fileCoverFile = null;
          this.fileCoverPreview = null;
          this.fileCoverFile = null;
          this.spinner.hide('global');
        });
    }
    console.log('this.fileCoverFile', this.fileCoverFile);
  }

  onSave(form) {
    this.save.emit();
    console.log('this.fileCoverFile', this.fileCoverFile);
  }
}

