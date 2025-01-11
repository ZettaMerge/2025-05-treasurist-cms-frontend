import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { FundPlanReBalanceLogDTO } from '@model';
import { RebalanceService } from '@api';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
@Component({
  selector: 'fe-rebalance-detail',
  templateUrl: './fe-rebalance-detail.component.html',
  styleUrls: ['./fe-rebalance-detail.component.scss']
})
export class FeRebalanceDetailComponent implements OnInit {

  reBalanceId: number;
  reBalanceData: FundPlanReBalanceLogDTO = {} as FundPlanReBalanceLogDTO;


  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private rebalanceService: RebalanceService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.reBalanceId = _.toNumber(this.route.snapshot.paramMap.get('id'));

    if (this.reBalanceId) {
      this.getReBalanceById();
    }
  }

  goBack() {
    this.router.navigate([`./agent/customer-service`]);
  }

  getReBalanceById() {
    this.spinner.show('global');
    this.rebalanceService.reBalanceLogIdGet$(this.reBalanceId).subscribe(data => {
      this.reBalanceData = data;
      this.spinner.hide('global');
    });
  }

  onExpireDate(reBalanceData: FundPlanReBalanceLogDTO) {
    const createdDate = moment(reBalanceData.createdDate).format('YYYY-MM-DD');
    const confirmationDate = moment(reBalanceData.confirmationDate);
    const day = confirmationDate.diff(createdDate, 'day');
    if (day > 30) {
      return true;
    } else {
      return false;
    }
  }
}
