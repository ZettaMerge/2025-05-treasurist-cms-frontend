import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService, FundService } from '@api';
import { _ } from 'core-js';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'fe-sync-data-modal',
  templateUrl: './fe-sync-data-modal.component.html',
  styleUrls: ['./fe-sync-data-modal.component.scss']
})
export class FeSyncDataModalComponent implements OnInit {

  @Input() id: any;
  @Input() type: any;
  @Input() effectiveDate: any;
  @Input() startEffectiveDate: any;
  @Output() getData = new EventEmitter();
  @Output() cancel = new EventEmitter();

  isShowSync = true;
  isShowSuccess = false;
  isShowFailed = false;

  lastManualSyncDate: string;


  constructor(
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private fundService: FundService,
  ) {
  }

  ngOnInit(): void {
    console.log('fundPlan', this.id);
    if (this.type === 'allot') {

      this.synAllotData();


    } else {
      this.onSyncData();
    }

  }

  onSaveSyncData() {
    this.getData.emit('true');
  }

  onCancel() {
    this.cancel.emit();
  }

  synAllotData() {
    this.isShowSync = true;
    this.fundService.fundSyncAlltotTransactionGet$().subscribe(res => {
      console.log('res.....', res);

      setTimeout(() => {
        this.isShowSync = false;
        this.isShowSuccess = true;
        this.isShowFailed = false;
      }, 3000);
      // if (res) {
      //   this.getData.emit(res);


      // }

    }, (error) => {
      if (error) {
        this.isShowSync = false;
        this.isShowSuccess = false;
        this.isShowFailed = true;
      }

    });

  }

  onSyncData() {
    this.isShowSync = true;
    console.log('fundPlan', this.id);
    this.accountService.accountSyncBackAccountTransactionGet$(
      this.effectiveDate ? moment(this.effectiveDate[1]).format('yyyyMMDD') : undefined,
      this.id ? this.id?.fcnAccountId : undefined,
      this.effectiveDate ? moment(this.effectiveDate[0]).format('yyyyMMDD') : undefined
    ).subscribe(res => {
      console.log('res.....', res);

      setTimeout(() => {
        this.isShowSync = false;
        this.isShowSuccess = true;
        this.isShowFailed = false;
      }, 3000);
      // if (res) {
      //   this.getData.emit(res);


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

    if (this.type === 'allot') {
      this.synAllotData();

    } else {

      this.onSyncData();
    }

  }


}
