import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'shared-view-customer-account-info',
  templateUrl: './shared-view-customer-account-info.component.html',
  styleUrls: ['./shared-view-customer-account-info.component.scss']
})
export class SharedViewCustomerAccountInfoComponent implements OnInit {


  @Input() data: any;
  cardExpiredDate;
  birthDate;

  constructor() {
  }

  ngOnInit(): void {

  }

}
