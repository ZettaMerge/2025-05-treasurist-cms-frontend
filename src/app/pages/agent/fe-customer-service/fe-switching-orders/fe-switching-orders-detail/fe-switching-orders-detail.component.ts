import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AgentService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import {FundPlanDraftDTO} from '@model';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'fe-switching-orders-detail',
  templateUrl: './fe-switching-orders-detail.component.html',
  styleUrls: ['./fe-switching-orders-detail.component.scss']
})
export class FeSwitchingOrdersDetailComponent implements OnInit {

  orderId: string;
  orderData: FundPlanDraftDTO = {} as FundPlanDraftDTO;

  status: string;
  draftType: string;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private agentService: AgentService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');

    if (this.orderId) {
      this.getOrderDetailById();
    }
  }

  goBack() {
    this.router.navigate([`./agent/customer-service`]);
  }

  getOrderDetailById() {
    this.spinner.show('global');

    this.agentService.customerFundPlanDraftByIdGet$(_.toNumber(this.orderId)).subscribe(
      data => {
        this.orderData = data;
        this.status = data.status;
        this.draftType = data.draftType;
        console.log('orderData', this.orderData);
        this.spinner.hide('global');
      });

  }

  goToTransaction(item) {

    const url = `order/transaction/detail/${item.saOrderNoView}`;
    window.open(url, '_blank');
    console.log('item', item);

  }
}
