import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseFeatureGridComponent} from '@postnerd-core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {debounce} from 'lodash';
import {AgentService} from "@api";
import {NgxSpinnerService} from "ngx-spinner";
import * as moment from "moment";
import {FundPlanDraftDTO} from "@model";

interface FilterType {
  search: string;
  icLicense: any;
  dateRange?: Date[];
  status: any;
  remark: any;
}

interface PropType extends FundPlanDraftDTO {
  'agent.icLicense'?: string;
  'fundPlan.fcnAccountId'?: string;
  'user.account.thFirstname'?: string;
  'user.account.thLastname'?: string;
}

@Component({
  selector: 'fe-investment-plan',
  templateUrl: './fe-investment-plan.component.html',
  styleUrls: ['./fe-investment-plan.component.scss']
})
export class FeInvestmentPlanComponent extends BaseFeatureGridComponent<PropType, any> implements OnInit {

  @ViewChild('icLicenseTpl', {static: true}) icLicenseTpl: TemplateRef<any>;
  @ViewChild('accountTpl', {static: true}) accountTpl: TemplateRef<any>;
  @ViewChild('statusTpl', {static: true}) statusTpl: TemplateRef<any>;
  @ViewChild('draftTypeTpl', {static: true}) draftTypeTpl: TemplateRef<any>;

  filterSearch: string;
  search: string;
  filter: FilterType = {} as FilterType;
  dataSub: Subscription;

  sortData = 'confirmationSentDate';
  direction = 'desc';
  draftType = ['AGENT_PLAN', 'CUSTOMIZED_PLAN', 'RISK_BASED_PLAN'];
  statusList = [
    { id: 1, name: 'PENDING' ,  value: 'PENDING'},
    { id: 2, name: 'ACCEPTED' ,  value: 'ACCEPTED'},
    { id: 3, name: 'DECLINED' ,  value: 'DECLINED'},
    { id: 4, name: 'ORDER EXP.',  value: 'ORDER_EXP'},
  ];

  remarkList = [
    { id: 1, name: 'มี' ,  value: false},
    { id: 2, name: 'ไม่มี' ,  value: true},
  ];


  constructor(
    private router: Router,
    private agentService: AgentService,
    private spinner: NgxSpinnerService,
  ) {
    super();
    this.searchTextChange = debounce(this.searchTextChange, 1000);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getData();
  }

  searchTextChange(event: string) {
    this.search = event;
    this.page.page = 1;
    this.getData();
    console.log('searchTextChange', event);
    console.log('event', event);
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
    const url = `agent/customer-service/investment-plan/${item.id}`;
    window.open(url, '_blank');
  }


  protected setColumns() {
    this.columns = [
      {
        name: 'วันที่ส่งคำสั่งให้ลูกค้า',
        prop: 'confirmationSentDate',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTpl
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
        name: 'ชื่อ-นามสกุล',
        prop: 'user.account.thFirstname',
        width: 170,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.accountTpl
      },
      {
        name: 'ประเภทแผน',
        prop: 'draftType',
        width: 120,
        sortable: true,
        cellTemplate: this.draftTypeTpl,
      },
      {
        name: 'มูลค่ารวม',
        prop: 'totalCost',
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
        cellTemplate: this.grid.dateTpl
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
        cellTemplate: this.grid.detailTpl,
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

    this.dataSub = this.agentService.customerFundPlanDraftListGet$(
      this.page.perPage,
      this.page.page,
      this.sortData,
      this.direction,
      this.draftType,
      this.filter.dateRange ? moment(this.filter.dateRange[1]).format('YYYY-MM-DD') : undefined,
      this.filter?.icLicense || undefined,
      this.filter.search || undefined,
      this.filter.dateRange ? moment(this.filter.dateRange[0]).format('YYYY-MM-DD') : undefined,
      this.filter?.status ? this.filter?.status?.value : undefined,
      this.filter?.remark ? this.filter?.remark?.value : undefined,
    ).subscribe(data => {
      this.rows = data.fundPlanDrafts;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
      console.log('data.totalContent', data);
      console.log('data.totalContent', data.fundPlanDrafts);
    });
  }

  clearFilter() {
    this.filter = {
      search: undefined,
      icLicense: undefined,
      dateRange: undefined,
      status: undefined,
      remark: undefined,
    } as FilterType;

    this.page.page = 1;
    this.getData();
  }
}
