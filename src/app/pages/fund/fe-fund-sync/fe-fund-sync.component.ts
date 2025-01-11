import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FundService } from '@api';
import { FundTypeEnum } from 'src/app/api/constant';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'fe-fund-sync',
  templateUrl: './fe-fund-sync.component.html',
  styleUrls: ['./fe-fund-sync.component.scss']
})
export class FeFundSyncComponent implements OnInit {

  @Output() getData = new EventEmitter();
  @Output() cancel = new EventEmitter();

  isShowSync = true;
  isShowSuccess = false;
  isShowFailed = false;

  lastManualSyncDate: string;
  fundTypeEnum = FundTypeEnum;
  typeFund: string;

  count = 1;


  constructor(
    private spinner: NgxSpinnerService,
    private fundService: FundService,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.onSyncData(this.fundTypeEnum.FundProfile);
  }

  onSaveSyncData() {
    this.getData.emit('true');
  }

  onCancel() {
    this.cancel.emit();
  }

  onSyncData(type: FundTypeEnum) {


    this.fundService.fundSyncGet$(type).subscribe(data => {
      this.isShowSync = true;
      // console.log('count....', this.count);
      // console.log('type....', type);

      if (data) {
        this.count = this.count + 1;

        if (this.count === 2) {
          this.onSyncData(this.fundTypeEnum.FundMapping);
        } else if (this.count === 3) {
          this.onSyncData(this.fundTypeEnum.FundHoliday);
        } else if (this.count === 4) {
          this.onSyncData(this.fundTypeEnum.TradeCalendar);
        } else if (this.count === 5) {
          this.onSyncData(this.fundTypeEnum.Fee);
        } else if (this.count === 6) {
          this.onSyncData(this.fundTypeEnum.Nav);
        } else if (this.count === 7) {
          this.onSyncData(this.fundTypeEnum.FundPerformance);

        } else {
          console.log('endddd');
          const lastManualSync = this.fundService.fundLastManualSyncGet$().subscribe(data => {
            console.log('lastManualSyncDate', data);
            this.lastManualSyncDate = data;
          });
          this.isShowSync = false;
          this.isShowSuccess = true;
          this.isShowFailed = false;
        }
      }

    }, (error) => {
      if (error) {

        if (this.count = 1) {
          this.typeFund = 'Fund Profile'
        }

        if (this.count = 2) {
          this.typeFund = 'Fund Mapping'
        }

        if (this.count = 3) {
          this.typeFund = 'Fund Holiday'
        }

        if (this.count = 4) {
          this.typeFund = 'Trade Calendar'
        }

        if (this.count = 5) {
          this.typeFund = 'Fee'
        }

        if (this.count = 6) {
          this.typeFund = 'Nav'
        }

        if (this.count = 7) {
          this.typeFund = 'Fund Performance'
        }

        this.isShowSync = false;
        this.isShowSuccess = false;
        this.isShowFailed = true;
      }
    });

  }

  onSyncAgain() {
    this.isShowSync = true;
    this.isShowFailed = false;
    this.isShowSuccess = false;
    this.onSyncData(this.fundTypeEnum.FundProfile)
  }


}
