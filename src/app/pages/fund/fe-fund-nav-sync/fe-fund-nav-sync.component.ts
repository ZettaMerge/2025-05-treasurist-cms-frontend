import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FundService } from '@api';
import { FundNavDTO } from '@model';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fe-fund-nav-sync',
  templateUrl: './fe-fund-nav-sync.component.html',
  styleUrls: ['./fe-fund-nav-sync.component.scss']
})
export class FeFundNavSyncComponent implements OnInit {

  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();


  fundData: any;
  fundNavData: FundNavDTO = {} as FundNavDTO;

  dataSub: Subscription;
  saveSub: Subscription;


  constructor(
    private spinner: NgxSpinnerService,
    private fundService: FundService,
    private toastrService: ToastrService,

  ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.cancel.emit();
  }

  onChangeFund(event) {

    if (event) {

      this.getFundNav();
    }
  }

  getFundNav() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.fundService.fundNavGet$(this.fundData?.fundCode).subscribe(
      data => {
        this.spinner.hide('global');
        this.fundNavData = data;

        // SET Data
        this.fundNavData.navDate = moment(this.fundNavData.navDate).startOf('day').toISOString(true);
      }
    )

  }

  onSave(form) {
    this.spinner.show('global')

    if (form.invalid) {
      this.spinner.hide('global')
      return;
    } else {

      // SET DATA
      this.fundNavData.aum = _.toNumber(this.fundNavData.aum);
      this.fundNavData.nav = _.toNumber(this.fundNavData.nav);
      this.fundNavData.bidNav = _.toNumber(this.fundNavData.bidNav);
      this.fundNavData.offerNav = _.toNumber(this.fundNavData.offerNav);
      this.fundNavData.switchInNav = _.toNumber(this.fundNavData.switchInNav);
      this.fundNavData.switchOutNav = _.toNumber(this.fundNavData.switchOutNav);
      this.fundNavData.totalAum = _.toNumber(this.fundNavData.totalAum);
      this.fundNavData.totalUnit = _.toNumber(this.fundNavData.totalUnit);
      this.fundNavData.navDate = moment(this.fundNavData.navDate).startOf('day').toISOString(true);


      this.saveSub = this.fundService.fundNavPut$(this.fundNavData.fundCode, this.fundNavData).subscribe(data => {
        this.spinner.hide('global');
        this.toastrService.success('Update Fund NAV Success.');
        this.save.emit();
      }, error => {
        this.spinner.hide('global');

      })

    }

  }

}
