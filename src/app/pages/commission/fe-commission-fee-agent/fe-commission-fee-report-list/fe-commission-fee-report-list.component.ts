import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {BaseFeatureGridComponent, PnStorageService} from '@postnerd-core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {CommissionFeeService} from '@api';
import {AgentCommissionFeeByPaymentTermAndTypesDTO, AgentCommissionFeeSummaryDTO} from '@model';
import * as moment from 'moment';
import * as _ from 'lodash';

interface FilterType {
  dateRange?: Date[];
}

@Component({
  selector: 'fe-commission-fee-report-list',
  templateUrl: './fe-commission-fee-report-list.component.html',
  styleUrls: ['./fe-commission-fee-report-list.component.scss']
})
export class FeCommissionFeeReportListComponent extends BaseFeatureGridComponent<AgentCommissionFeeByPaymentTermAndTypesDTO, any> implements OnInit {

  @ViewChild('statusTpl', {static: true}) statusTpl: TemplateRef<any>;

  @Output() onClickShowDetailInfo = new EventEmitter<any>();

  agentPortData: AgentCommissionFeeSummaryDTO = {} as AgentCommissionFeeSummaryDTO;
  filter: FilterType = {} as FilterType;
  dataSub: Subscription;

  agentId: any;

  sortData = 'paymentDate';
  direction = 'desc';

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private commissionFeeService: CommissionFeeService,
    private storageService: PnStorageService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.agentId = this.route.snapshot.paramMap.get('id');

    if (this.agentId) {
      this.getPortById();
      super.ngOnInit();
      this.getData();
    }

  }

  onDateChange() {
    this.getPortById();
    this.page.page = 1;
    this.getData();

  }

  getPortById() {
    this.spinner.show('global');

    this.commissionFeeService.agentCommissionFeeByPaymentTermsAndTypeDetailGet$(
      _.toNumber(this.agentId),
      undefined,
      undefined,
      this.filter.dateRange ? moment(this.filter.dateRange[1]).format('yyyy-MM-DD') : undefined,
      undefined,
      this.filter.dateRange ? moment(this.filter.dateRange[0]).format('yyyy-MM-DD') : undefined,
      undefined,
    ).subscribe(data => {
      this.agentPortData = data;
      this.spinner.hide('global');
    });
  }

  onSortChange(data) {
    this.sortData = data.sortBy;
    this.direction = data.asc ? 'asc' : 'desc';
    console.log('this.sort', this.sortData);
    this.page.page = 1;
    this.getData();
  }


  goBack() {
    this.router.navigate([`./commission/commission-fee`]);
  }

  detailInfo(item) {
    console.log('item', item);
    const url = `commission/commission-fee/report-detail/${item.icLicense}/${this.agentId}/${item.paymentTermId}/${item.type}`;
    window.open(url, '_blank');
  }

  protected setColumns() {
    this.columns = [
      {
        name: 'Payment Date',
        prop: 'paymentDate',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTpl,
      },
      {
        name: ' Description',
        prop: 'description',
        width: 250,
        sortable: true,
        cellClass: 'align-items-center text-wrap',
        headerClass: 'align-items-center',
      },
      {
        name: 'Type',
        prop: 'type',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'ส่วนแบ่ง',
        prop: 'agentRate',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.percentWithDecimalTpl,
      },
      {
        name: 'สถานะ',
        prop: 'status',
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.statusTpl,
      },
      {
        name: '', prop: '_action',
        cellTemplate: this.grid.detailTpl,
        width: 100,
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

    this.dataSub = this.commissionFeeService.agentCommissionFeeByPaymentTermsAndTypeListGet$(
      _.toNumber(this.agentId),
      this.page.page,
      this.page.perPage,
      this.sortData,
      this.direction,
      this.filter.dateRange ? moment(this.filter.dateRange[1]).format('yyyy-MM-DD') : undefined,
      undefined,
      this.filter.dateRange ? moment(this.filter.dateRange[0]).format('yyyy-MM-DD') : undefined,
      undefined,
    ).subscribe(data => {
      this.rows = data.agentCommissionFeeByPaymentTermAndTypes;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
    });

  }

  clearFilter() {
    this.filter = {
      dateRange: undefined,
    } as FilterType;

    this.getPortById();
    this.page.page = 1;
    this.getData();
  }

}
