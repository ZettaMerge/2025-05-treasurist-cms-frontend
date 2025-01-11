import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService, FundService } from '@api';
import { error } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'fe-sync-account',
  templateUrl: './fe-sync-account.component.html',
  styleUrls: ['./fe-sync-account.component.scss']
})
export class FeSyncAccountComponent implements OnInit {

  @Input() data: any;
  @Output() getData = new EventEmitter();
  @Output() cancel = new EventEmitter();

  isShowSync = true;
  isShowSuccess = false;
  isShowFailed = false;

  lastManualSyncDate: string;


  constructor(
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
  ) {
  }

  ngOnInit(): void {
    this.onSyncData();
  }

  onSaveSyncData() {
    this.getData.emit('true');
  }

  onCancel() {
    this.cancel.emit();
  }

  onSyncData() {
    this.isShowSync = true;

    this.accountService.accountSyncBackAccountGet$(this.data.id).subscribe(res => {
      console.log('res', res);

      setTimeout(() => {
        this.isShowSync = false;
        this.isShowSuccess = true;
        this.isShowFailed = false;
        // this.getData.emit(res);
      }, 3000);
      // if (res) {
      //   


      // }

    }, (error) => {
      if (error) {
        this.isShowSync = false;
        this.isShowSuccess = false;
        this.isShowFailed = true;
      }

    })
  }

  onSyncAgain() {
    this.isShowSync = true;
    this.isShowFailed = false;
    this.isShowSuccess = false;
    this.onSyncData();
  }


}
