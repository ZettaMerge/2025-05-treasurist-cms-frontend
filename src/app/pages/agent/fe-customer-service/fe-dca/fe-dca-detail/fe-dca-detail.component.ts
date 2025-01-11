import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FundPlanDraftDTO, FundPlanDraftSummaryFundDTO} from '@model';
import {AgentService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import * as _ from 'lodash';

@Component({
  selector: 'fe-dca-detail',
  templateUrl: './fe-dca-detail.component.html',
  styleUrls: ['./fe-dca-detail.component.scss']
})
export class FeDcaDetailComponent implements OnInit {

  dcaId: string;
  dcaData: FundPlanDraftSummaryFundDTO = {} as FundPlanDraftSummaryFundDTO;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private agentService: AgentService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.dcaId = this.route.snapshot.paramMap.get('id');

    if (this.dcaId) {
      this.getDcaDetailById();
    }
  }

  goBack() {
    this.router.navigate([`./agent/customer-service`]);
  }

  getDcaDetailById() {
    this.spinner.show('global');

    this.agentService.customerFundPlanDraftSummaryByIdGet$(_.toNumber(this.dcaId)).subscribe(
      data => {
        this.dcaData = data;
        console.log('orderData', this.dcaData);
        this.spinner.hide('global');
      });
  }

  convertFundPlanSummary(item) {
    const summaryPlan =  _.sumBy(item, 'recurringCost');
    return summaryPlan;

    console.log('summaryPlan', summaryPlan);
  }
}
