import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseFeatureGridComponent} from "@postnerd-core";
import {CustomerListDTO, UserBalanceDTO} from "@model";
import {NgxSpinnerService} from "ngx-spinner";
import {CustomerService, CustomNotificationsService} from "@api";
import {Subscription} from "rxjs";
import * as _ from 'lodash';

@Component({
  selector: 'custom-notification-customer-detail',
  templateUrl: './custom-notification-customer-detail.component.html',
  styleUrls: ['./custom-notification-customer-detail.component.scss']
})
export class CustomNotificationCustomerDetailComponent extends BaseFeatureGridComponent<UserBalanceDTO, any> implements OnInit, OnDestroy {

  @Input() customNotificationId: string;

  @ViewChild('nameTpl', { static: true }) nameTpl: TemplateRef<any>;
  @ViewChild('portTpl', { static: true }) portTpl: TemplateRef<any>;
  @ViewChild('portCostTpl', { static: true }) portCostTpl: TemplateRef<any>;
  @ViewChild('costTpl', { static: true }) costTpl: TemplateRef<any>;
  @ViewChild('profit', { static: true }) profit: TemplateRef<any>;
  @ViewChild('fundTpl', {static: true}) fundTpl: TemplateRef<any>;

  dataSub: Subscription;

  sortData: string;
  direction: string;

  constructor(
    private spinner: NgxSpinnerService,
    private customNotificationsService: CustomNotificationsService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getData();
  }

  onSortChange(data) {
    this.sortData = data.sortBy;
    this.direction = data.asc ? 'asc' : 'desc';
    console.log('this.sort', this.sortData);
    this.page.page = 1;
    this.getData();
  }

  protected setColumns() {
    this.columns = [
      {
        name: 'ชื่อ-นามสกุล',
        prop: 'customerName',
        width: 200,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.nameTpl,
        sortBy: 'customerName',
      },
      {
        name: 'กองทุน',
        prop: 'fundCode',
        sortable: true,
        width: 120,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.fundTpl,
        sortBy: 'fundCode'
      },
      {
        name: 'ต้นทุนรวม',
        prop: 'cost',
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        width: 120,
        cellTemplate: this.portCostTpl,
        sortable: true,
        sortBy: 'cost'
      },
      {
        name: 'มูลค่ารวม',
        prop: 'amount',
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'amount',
        sortable: true,
        width: 120,
        cellTemplate: this.portTpl,
      },
      {
        name: 'กำไร ขาดทุน',
        prop: 'profit',
        width: 100,
        cellTemplate: this.profit,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'profit',
        sortable: true,
      },
    ];
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.customNotificationsService.customNotificationsCustomerHistoryByIdGet$(
      this.sortData,
      _.toNumber(this.customNotificationId),
      this.direction,
      this.page.perPage,
      this.page.page,
    ).subscribe((data) => {
      this.rows = data.customNotiCusHistories;
      this.page.totalCount = data.pagination.allRecord;
      // this.page.page = data.pagination.page;
      this.spinner.hide('global');
    });
  }

  convertString(item) {
    const convertString = _.toString(item);
    return convertString;
  }

}
