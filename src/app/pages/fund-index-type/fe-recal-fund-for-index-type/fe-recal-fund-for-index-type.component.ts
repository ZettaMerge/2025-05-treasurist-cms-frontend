import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FundIndexService } from '@api';
import { FundIndexCalculateFundDTO } from '@model';
import moment from 'moment';

@Component({
  selector: 'fe-recal-fund-for-index-type',
  templateUrl: './fe-recal-fund-for-index-type.component.html',
  styleUrls: ['./fe-recal-fund-for-index-type.component.scss']
})
export class FeRecalFundForIndexTypeComponent implements OnInit {

  @Output() getData = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() syncFinish = new EventEmitter();
  @Output() onDisableSync = new EventEmitter();



  recalDate: any;

  isShowSync = false;
  isShowSuccess = false;
  isShowFailed = false;
  isShowRecalForm = true;

  lastManualSyncDate: string;

  constructor(
    private fundIndexService: FundIndexService,


  ) { }

  ngOnInit(): void {
  }


  onCancel() {
    this.cancel.emit();
  }

  onStartSync() {

    const calDate: FundIndexCalculateFundDTO = {
      date: this.recalDate ? moment(this.recalDate).format('YYYY-MM-DD') : null
    } as FundIndexCalculateFundDTO;

    this.fundIndexService.fundIndexCalculateFundAllPost$(calDate).subscribe(data => {

      console.log('data...recal', data)
    }, error => {

    });

    setTimeout(() => {
      this.isShowSync = true;
      this.isShowRecalForm = false;

    }, 300);

  }

  onCloseSync() {
    this.onDisableSync.emit();
  }

  onSaveSyncData() {

    this.syncFinish.emit();
  }




}
