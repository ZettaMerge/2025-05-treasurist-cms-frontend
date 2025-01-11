import { Component, OnInit } from '@angular/core';
import {BaseFeatureTabComponent} from '@postnerd-core';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {debounce} from 'lodash';


enum Tab {
  switchingorder = 1,
  investmentplan = 2,
  rebalance = 3,
  dca = 4,
}
interface FilterType {
  search: string;
  icLicense: any;
}

@Component({
  selector: 'fe-customer-service',
  templateUrl: './fe-customer-service.component.html',
  styleUrls: ['./fe-customer-service.component.scss']
})
export class FeCustomerServiceComponent extends BaseFeatureTabComponent implements OnInit {

  filterSearch: string;
  search: string;
  filter: FilterType = {} as FilterType;

  Tab = Tab;

  tabs = [
    {name: 'คำสั่งซื้อ ขาย สับเปลี่ยน', id: Tab.switchingorder},
    {name: 'แผนลงทุน', id: Tab.investmentplan},
    {name: 'Re-balance', id: Tab.rebalance},
    {name: 'DCA', id: Tab.dca},
  ];

  constructor(
    protected route: ActivatedRoute,
    private router: Router,
) {
    super(route);

  }

  ngOnInit(): void {
  }



  filterChange() {
    // this.page.page = 1;
    // this.getData();
  }

  onChangeTab() {
  }



}
