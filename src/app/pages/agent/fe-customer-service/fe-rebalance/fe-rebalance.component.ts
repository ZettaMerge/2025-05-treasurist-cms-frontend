import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseFeatureGridComponent } from '@postnerd-core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { debounce } from 'lodash';
import { RebalanceService } from '../../../../api/service/rebalance.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { FundPlanReBalanceLogDTO } from '@model';
import { reBalanceLogTypeText } from 'src/app/api/constant/EnumText';

interface FilterType {
  search: string;
  icLicense: any;
  dateRangeConfirmationDate: Date;
  dateRange: Date;
  status: any;
  remark: any;
  sentBy: any;
}

interface PropType extends FundPlanReBalanceLogDTO {
  'agent.icLicense'?: string;
  'fundPlan.fcnAccountId'?: string;
  'user.account.thFirstname'?: string;
  'user.account.thLastname'?: string;
}

@Component({
  selector: 'fe-rebalance',
  templateUrl: './fe-rebalance.component.html',
  styleUrls: ['./fe-rebalance.component.scss']
})
export class FeRebalanceComponent extends BaseFeatureGridComponent<PropType, any> implements OnInit {

  @ViewChild('icLicenseTpl', { static: true }) icLicenseTpl: TemplateRef<any>;
  @ViewChild('accountTpl', { static: true }) accountTpl: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;
  @ViewChild('confirmationDateTpl', { static: true }) confirmationDateTpl: TemplateRef<any>;
  @ViewChild('createdDateTpl', { static: true }) createdDateTpl: TemplateRef<any>;
  @ViewChild('detailTpl', { static: true }) detailTpl: TemplateRef<any>;

  dataSub: Subscription;
  filter: FilterType = {} as FilterType;
  statusList = [
    { id: 1, name: 'PENDING', value: 'PENDING' },
    { id: 2, name: 'ACCEPTED', value: 'ACCEPTED' },
    { id: 3, name: 'ORDER EXP.', value: 'EXPIRE' },
  ];

  remarkList = [
    { id: 1, name: 'มี', value: false },
    { id: 2, name: 'ไม่มี', value: true },
  ];

  sentByList = [
    { id: 1, name: 'Customer', value: 'CUSTOMER' },
    { id: 2, name: 'Agent', value: 'AGENT' },
    { id: 3, name: 'System', value: 'SYSTEM' },
  ];

  sortData = 'createdDate';
  direction = 'desc';
  draftType = ['AGENT_PLAN', 'CUSTOMIZED_PLAN', 'RISK_BASED_PLAN'];
  reBalanceLogTypeText = reBalanceLogTypeText;
  constructor(
    private router: Router,
    private rebalanceService: RebalanceService,
    private spinner: NgxSpinnerService,
  ) {
    super();
    this.searchTextChange = debounce(this.searchTextChange, 1000);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getData();
  }

  searchTextChange(event) {
    this.page.page = 1;
    this.getData();
  }

  filterChange() {
    this.page.page = 1;
    this.getData();
  }

  onSortChange(data) {
    this.sortData = data.sortBy;
    this.direction = data.asc ? 'asc' : 'desc';
    console.log('this.sort', this.sortData);
    this.page.page = 1;
    this.getData();
  }

  detailInfo(item) {
    const url = `agent/customer-service/rebalance/${item.id}`;
    window.open(url, '_blank');
  }

  protected setColumns() {
    this.columns = [
      {
        name: 'วันที่ส่งคำสั่งให้ลูกค้า',
        prop: 'createdDate',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.createdDateTpl,
      },
      {
        name: 'IC License',
        prop: 'agent.icLicense',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.icLicenseTpl
      },
      {
        name: 'Account ID',
        prop: 'user.account.thFirstname',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.accountTpl
      },
      {
        name: 'มูลค่ารวมพอร์ต',
        prop: 'planBalance',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.decimalTpl,
      },
      {
        name: 'มูลค่าลงทุนต่อเดือน',
        prop: 'recurringCost',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.decimalTpl,
      },
      {
        name: 'วันที่ทำรายการ',
        prop: 'confirmationDate',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.confirmationDateTpl
      },
      {
        name: 'สถานะ',
        prop: 'status',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.statusTpl,
      },
      {
        name: '', prop: '_action',
        cellTemplate: this.detailTpl,
        width: 80,
        sortable: false,
        canAutoResize: false,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
      },
    ];
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.rebalanceService.reBalanceLogListGet$(
      this.sortData, // columnName
      this.direction, // direction
      this.filter.dateRange ? moment(this.filter.dateRange[1]).format('YYYY-MM-DD') : undefined, // endConfirmationDate
      this.filter.dateRangeConfirmationDate ? moment(this.filter.dateRangeConfirmationDate[1]).format('YYYY-MM-DD') : undefined, // endSendDate
      undefined, // fundPlanId
      this.filter?.icLicense || undefined, // icLicense
      this.filter?.remark ? this.filter?.remark?.value : undefined, // isCompleteTransaction
      this.page.perPage, // limit
      this.page.page, // page
      this.filter?.sentBy ? this.filter?.sentBy?.value : undefined, // reBalanceLogTypes
      this.filter.search || undefined, // search
      this.filter.dateRange ? moment(this.filter.dateRange[0]).format('YYYY-MM-DD') : undefined, // startConfirmationDate
      this.filter.dateRangeConfirmationDate ? moment(this.filter.dateRangeConfirmationDate[0]).format('YYYY-MM-DD') : undefined, // endSendDate
      this.filter?.status ? this.filter?.status?.value : undefined, // statuses
      undefined,
    ).subscribe(data => {
      this.rows = data.fundPlanReBalanceLogDTOS;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
    });
  }

  clearFilter() {
    this.filter = {
      search: undefined,
      icLicense: undefined,
      dateRangeConfirmationDate: undefined,
      dateRange: undefined,
      status: undefined,
      remark: undefined,
      sentBy: undefined,
    } as FilterType;

    this.page.page = 1;
    this.getData();
  }

  onExpireDate(row) {
    const createdDate = moment(row.createdDate).format('YYYY-MM-DD');
    const confirmationDate = moment(row.confirmationDate);
    const day = confirmationDate.diff(createdDate, 'day');
    if (day > 30) {
      return true;
    } else {
      return false;
    }
  }
}
