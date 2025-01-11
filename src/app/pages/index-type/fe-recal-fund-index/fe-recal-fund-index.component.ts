import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FundIndexService } from '@api';
import { FundIndexCalculateFundDTO, IndexTypeDTO } from '@model';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fe-recal-fund-index',
  templateUrl: './fe-recal-fund-index.component.html',
  styleUrls: ['./fe-recal-fund-index.component.scss']
})
export class FeRecalFundIndexComponent implements OnInit {

  @Output() getData = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() syncFinish = new EventEmitter();
  @Output() onDisableSync = new EventEmitter();



  recalDate: any;
  indexType: any;

  isShowSync = false;
  isShowSuccess = false;
  isShowFailed = false;
  isShowRecalForm = true;

  lastManualSyncDate: string;

  indexTypeList: IndexTypeDTO[] = [];
  dropdownSub: Subscription;

  constructor(
    private fundIndexService: FundIndexService,


  ) { }

  ngOnInit(): void {
    this.getIndexTypeDropdown();
  }


  onCancel() {
    this.cancel.emit();
  }

  getIndexTypeDropdown() {
    if (this.dropdownSub) {
      this.dropdownSub.unsubscribe();
    }


    this.dropdownSub = this.fundIndexService.fundIndexIndexTypeListGet$(
      'name',
      'asc',
      true,
      9999,
      undefined,
      1
    ).subscribe(data => {
      this.indexTypeList = data.indexTypes;
    });

  }

  indexTypeChange(event) {

    console.log('change..', event)
  }

  onStartSync() {

    const calDate: FundIndexCalculateFundDTO = {
      date: this.recalDate ? moment(this.recalDate).format('YYYY-MM-DD') : null,
      indexTypeId: this.indexType ? this.indexType?.id : null

    } as FundIndexCalculateFundDTO;

    this.fundIndexService.fundIndexCalculateFundIndexPost$(calDate).subscribe(data => {

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
