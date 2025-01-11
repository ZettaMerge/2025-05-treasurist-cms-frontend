import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseFeatureGridComponent} from '@postnerd-core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'fe-customer-list',
  templateUrl: './fe-customer-list.component.html',
  styleUrls: ['./fe-customer-list.component.scss']
})
export class FeCustomerListComponent extends BaseFeatureGridComponent<any> implements OnInit {

  @ViewChild('customerTpl', { static: true }) customerTpl: TemplateRef<any>;
  @ViewChild('nameTpl', { static: true }) nameTpl: TemplateRef<any>;
  dataSub: Subscription;

  constructor(
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getData();
  }

  protected setColumns() {
    this.columns = [
      {
        name: 'Account ID',
        prop: 'accountId',
        width: 150,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'transactionId',
        cellTemplate: this.nameTpl,
      },
      {
        name: 'ประเภทลูกค้า',
        prop: 'customerType',
        sortable: false,
        width: 100,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.customerTpl,
      },
      {
        name: 'ประเภทบัญชี',
        prop: 'accountType',
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        width: 130,
      },
      {
        name: 'วันที่ทำรายการ',
        prop: 'dateTransaction',
        sortable: false,
        width: 120,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
    ];
  }

  protected getData() {

    this.rows = [
      {id: 1, accountId: 'ACC3001', dateTransaction: '20/08/2021', accountType: 'Individual', customerType: 'General', firstName: 'John', lastName: 'Miller'},
      {id: 2, accountId: 'ACC3002', dateTransaction: '20/08/2021', accountType: 'Individual', customerType: 'Vulnerable', firstName: 'Bai', lastName: 'Lu'},
      {id: 3, accountId: 'ACC3003', dateTransaction: '20/08/2021', accountType: 'Individual', customerType: 'General', firstName: 'Ney', lastName: 'Miller'},
      {id: 4, accountId: 'ACC3004', dateTransaction: '20/08/2021', accountType: 'Individual', customerType: 'General', firstName: 'John', lastName: 'Rbudabi'},
    ];
    this.page.totalCount = this.rows.length;
  }

}
