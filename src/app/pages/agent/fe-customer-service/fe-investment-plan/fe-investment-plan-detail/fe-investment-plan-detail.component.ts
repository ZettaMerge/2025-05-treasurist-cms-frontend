import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FundPlanDraftSummaryFundDTO} from '@model';
import {AgentService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import * as _ from 'lodash';

@Component({
  selector: 'fe-investment-plan-detail',
  templateUrl: './fe-investment-plan-detail.component.html',
  styleUrls: ['./fe-investment-plan-detail.component.scss']
})
export class FeInvestmentPlanDetailComponent implements OnInit {

  investId: string;
  investPlanData: FundPlanDraftSummaryFundDTO = {} as FundPlanDraftSummaryFundDTO;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private agentService: AgentService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.investId = this.route.snapshot.paramMap.get('id');

    if (this.investId) {
      this.getInvestPlanData();
    }
  }

  goBack() {
    this.router.navigate([`./agent/customer-service`]);
  }

  getInvestPlanData() {
    this.spinner.show('global');

    this.agentService.customerFundPlanDraftSummaryByIdGet$(_.toNumber(this.investId)).subscribe(
      data => {
        this.investPlanData = data;
        console.log('orderData', this.investPlanData);
        this.spinner.hide('global');
      });
  }
}
