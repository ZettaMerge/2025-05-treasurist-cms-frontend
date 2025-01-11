import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseFeatureGridComponent} from '@postnerd-core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {NgxSpinnerService} from 'ngx-spinner';
import {CommissionFeeService} from '@api';
import {AgentCommissionFeeDTO} from '@model';
import * as moment from 'moment';
import {debounce} from 'lodash';

interface FilterType {
  search: string;
  team: any;
  dateRange?: Date[];
}

@Component({
  selector: 'fe-commission-fee-agent',
  templateUrl: './fe-commission-fee-agent.component.html',
  styleUrls: ['./fe-commission-fee-agent.component.scss']
})
export class FeCommissionFeeAgentComponent extends BaseFeatureGridComponent<AgentCommissionFeeDTO, any> implements OnInit {

  @ViewChild('nameTpl', {static: true}) nameTpl: TemplateRef<any>;

  filter: FilterType = {} as FilterType;
  dataSub: Subscription;

  sortData = 'agentName';
  direction = 'desc';

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private commissionFeeService: CommissionFeeService,
  ) {
    super();
    this.searchTextChange = debounce(this.searchTextChange, 1000);
  }



  ngOnInit(): void {
    super.ngOnInit();
    this.getData();
  }

  searchTextChange(event: string) {
    this.page.page = 1;
    this.getData();
  }

  filterChange() {
    console.log('temaiid', this.filter.team?.id);
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
    const url = `commission/commission-fee/report/${item.agentId}`;
    window.open(url, '_blank');
  }

  protected setColumns() {
    this.columns = [
      {
        name: 'ชื่อ-นามสกุล',
        prop: 'agentName',
        width: 200,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'Team',
        prop: 'teamName',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'IC License',
        prop: 'icLicense',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'Front-End Fee',
        prop: 'feFee',
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.decimalTpl,
      },
      {
        name: 'Trailing Fee',
        prop: 'trFee',
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.decimalTpl,
      },
      {
        name: 'Promotion Fee',
        prop: 'proFee',
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.decimalTpl,
      },
      {
        name: 'Total Agent Total',
        prop: 'total',
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.decimalTpl,
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

    this.dataSub = this.commissionFeeService.agentCommissionFeeListGet$(
      this.page.page,
      this.page.perPage,
     this.sortData,
     this.direction,
      this.filter.dateRange ? moment(this.filter.dateRange[1]).format('yyyy-MM-DD') : undefined,
     this.filter.search,
      this.filter.dateRange ? moment(this.filter.dateRange[0]).format('yyyy-MM-DD') : undefined,
     this.filter?.team?.id,
    ).subscribe(data => {
      this.rows = data.agentCommissionFees;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
    });

  }

  clearFilter() {
    this.filter = {
      search: undefined,
      team: undefined,
      dateRange: undefined,
    } as FilterType;

    this.page.page = 1;
    this.getData();
  }

}
