import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import {AccountService} from "@api";
import {NgxSpinnerService} from "ngx-spinner";
import {FileSaverService} from "ngx-filesaver";

@Component({
  selector: 'shared-view-popup-detail-file-account-opening',
  templateUrl: './shared-view-popup-detail-file-account-opening.component.html',
  styleUrls: ['./shared-view-popup-detail-file-account-opening.component.scss']
})
export class SharedViewPopupDetailFileAccountOpeningComponent implements OnInit {
  @Input() mode: string;
  @Input() accountFile: any;
  @Input() account: boolean;
  @Input() customer: boolean;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  fileCoverPreview;
  fileCover;
  fileCoverFile;
  isShow: boolean;
  isShowHistory: boolean;
  filename: string;

  // subscribe
  dataSub: Subscription;
  saveSub: Subscription;
  constructor(
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private fileSaverService: FileSaverService,
  ) { }

  ngOnInit(): void {
    this.isShow = false;
    this.isShowHistory = true;
  }

  onOpenModal(mod) {

  }

  onDownloadFile(item) {
    console.log('item', item);
    if (item && this.account) {
      this.spinner.show('global');
      this.accountService.accountDownloadFileGet$(item.id).subscribe( data => {
        console.log('res download', data);
        this.spinner.hide('global');
        this.fileSaverService.save(data, `${this.mode}.pdf`);
      });
    } else if (item && this.customer) {
      this.spinner.show('global');
      this.accountService.accountDownloadFileGet$(item.id).subscribe( data => {
        console.log('res download', data);
        this.spinner.hide('global');
        this.fileSaverService.save(data, `${this.mode}.pdf`);
      });
    }
  }

  onClickNewUpload() {
    this.isShowHistory = false;
    this.isShow = true;
  }

  onSave(form) {

  }

  onSelectFileCover(event) {
    console.log('onSelectFileCover', event);
    this.fileCoverFile = event;
    const reader = new FileReader();
    reader.onload = e => {
      this.fileCoverPreview = e.target.result;
      console.log(' this.fileCoverPreview', this.fileCoverPreview);
    };
    reader.readAsDataURL(this.fileCoverFile);
    console.log(' this.fileCoverFile', this.fileCoverFile);
  }

  removeImageCover() {
    this.fileCoverFile = null;
    this.fileCoverPreview = null;
  }
  onCancel() {
    this.cancel.emit();
  }
}
