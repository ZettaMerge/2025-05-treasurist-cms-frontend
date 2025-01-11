import {Component, Input, OnInit} from '@angular/core';
import moment from 'moment';
import {CustomerService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';
import {CustomerPortfolioDTO} from '@model';

@Component({
  selector: 'fe-customer-protfolio',
  templateUrl: './fe-customer-protfolio.component.html',
  styleUrls: ['./fe-customer-protfolio.component.scss']
})
export class FeCustomerProtfolioComponent implements OnInit {

  @Input() data;
  @Input() customerId: string;
  isTabViewPort = false;
  portFolioData: CustomerPortfolioDTO = {} as CustomerPortfolioDTO;
  fundPlanId: number;
  originalFundPlanId: number;
  filterFundPlan: any;
  fcnAccountId: string;
  fundCode: string;

  resetDropdown = false;

  dataSub: Subscription;

  profit = -5997.77;

  currentDate = moment().toString();
  listsDropdown = [];


  constructor(
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.getPortFolioById();
  }

  goToDetail(portFolio) {
    console.log('portfolito', portFolio);
    this.fundPlanId = portFolio.id;
    this.fcnAccountId = portFolio.fcnAccountId;
    this.originalFundPlanId = portFolio.id;
    this.isTabViewPort = !this.isTabViewPort;

    // PREFILL FILTER PLAN
    const findFundPlan = this.listsDropdown.find(fundPlan => fundPlan.id === this.fundPlanId);
    this.filterFundPlan = findFundPlan;

  }

  goBackToport() {
    this.filterFundPlan = undefined;
    this.isTabViewPort = !this.isTabViewPort;
  }

  getPortFolioById() {
    this.spinner.show('global');

    this.customerService.customerPortfolioIdGet$(_.toNumber(this.customerId)).subscribe(
      (data) => {
        if (data) {
          this.portFolioData = data;
          this.spinner.hide('global');
        }
      });

    this.customerService.customerIdInfoGet$(_.toNumber(this.customerId)).subscribe(data => {
      // console.log('data dd', data.fundPlans);
      if (data.fundPlans) {
        for (const fund of data.fundPlans) {
          this.listsDropdown.push({
            id: fund.id,
            name: `${fund.fcnAccountId} - ${fund.name}`,
            fcnAccountId: fund.fcnAccountId
          });
        }
      }

    });
  }

  filterChange() {
    if (this.filterFundPlan) {
      this.fundPlanId = this.filterFundPlan.id;
      this.fcnAccountId = this.filterFundPlan.fcnAccountId;
    }
  }


}
