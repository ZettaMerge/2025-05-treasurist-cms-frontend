import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {BaseFeatureGridComponent, ModalComponent} from '@postnerd-core';
import {NgxSpinnerService} from 'ngx-spinner';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {AccountService} from '@api';
import {debounce} from 'lodash';
import * as moment from "moment";

interface FilterType {
  search: string;
  dateRange?: Date[];
  icLicense: any;
}

@Component({
  selector: 'fe-open-account-list',
  templateUrl: './fe-open-account-list.component.html',
  styleUrls: ['./fe-open-account-list.component.scss']
})
export class FeOpenAccountListComponent extends BaseFeatureGridComponent<any> implements OnInit {

  @ViewChild('accountIDTpl', {static: true}) accountIDTpl: TemplateRef<any>;
  @ViewChild('icLicenseTpl', {static: true}) icLicenseTpl: TemplateRef<any>;
  @ViewChild('fxTpl', {static: true}) fxTpl: TemplateRef<any>;
  @ViewChild('commoTpl', {static: true}) commoTpl: TemplateRef<any>;
  @ViewChild('customerTypeTpl', {static: true}) customerTypeTpl: TemplateRef<any>;
  @ViewChild('actionStatusTpl', {static: true}) actionStatusTpl: TemplateRef<any>;

  // Modal
  @ViewChild('rejectDetailModal') modal: ModalComponent;

  dataSub: Subscription;
  accountId: number;
  customerType: string;
  statusApproval: string;

  filter: FilterType = {} as FilterType;

  sortData = 'fcnAccountId';
  direction = 'desc';


  statusApprovalList = [
    {label: 'All', value: undefined},
    {label: 'Draft', value: 'Draft'},
    {label: 'Rejected', value: 'Rejected'}
  ];

  typeCustomerlists = [
    {label: 'All', value: undefined},
    {label: 'General', value: 'Individual'},
    {label: 'Juristic', value: 'Juristic'},
  ];


  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
  ) {
    super();
    this.searchTextChange = debounce(this.searchTextChange, 1000);
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

  detail(item) {
    // this.router.navigate([`./customer/list/profile/${item.id}`]);
  }

  filterChange() {
    this.page.page = 1;
    this.getData();
  }


  protected setColumns() {
    this.columns = [
      {
        name: 'Account ID',
        prop: 'fcnAccountId',
        width: 200,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.accountIDTpl,
      },
      {
        name: 'IC License',
        prop: 'icLicense',
        sortable: true,
        width: 200,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.icLicenseTpl,
      },
      {
        name: 'Team',
        prop: 'icTeam',
        sortable: true,
        width: 120,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },

      {
        name: 'วันที่ทำรายการ',
        prop: 'applicationDate',
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        width: 100,
        cellTemplate: this.grid.dateTpl
      },
      {
        name: 'ประเภทลูกค้า',
        prop: 'accountType',
        sortable: true,
        width: 100,
        cellClass: 'justify-content-center align-items-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.customerTypeTpl,
      },
      {
        name: 'Fx',
        prop: 'canAcceptFxRisk',
        sortable: true,
        width: 80,
        cellClass: 'justify-content-center align-items-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.fxTpl,
      },
      {
        name: 'Commo',
        prop: 'canCommo',
        sortable: true,
        width: 80,
        cellClass: 'justify-content-center align-items-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.commoTpl,
      },
      {
        name: '',
        prop: 'accountStatus',
        sortable: false,
        width: 150,
        cellClass: 'justify-content-start align-items-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.actionStatusTpl,
      },
    ];
  }

  protected getData() {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.spinner.show('global');
    this.dataSub = this.accountService.accountListGet$(
      this.statusApproval === undefined ? ['Draft', 'Rejected'] : [this.statusApproval],
      this.customerType,
      undefined,
      this.filter.dateRange ? moment(this.filter.dateRange[1]).format('yyyy-MM-DD') : undefined,
      this.page.page,
      this.page.perPage,
      this.filter.dateRange ? moment(this.filter.dateRange[0]).format('yyyy-MM-DD') : undefined,
      this.filter.search,
      this.sortData,
      this.direction,
    ).subscribe((data) => {
      this.rows = data.accounts;
      this.page.totalCount = data.pagination.allRecord;
      // this.page.page = data.pagination.page;
      this.spinner.hide('global');
      console.log('accountService', this.rows);

    });
  }

  searchTextChange(event: string) {
    console.log('searchTextChange', event);
    this.page.page = 1;
    this.getData();
  }

  clearFilter() {
    this.filter = {
      search: undefined,
      dateRange: undefined,
      icLicense: undefined,
    } as FilterType;

    this.customerType = undefined;
    this.statusApproval = undefined;

    this.page.page = 1;
    this.getData();
  }

  goToFormGeneral() {
    this.router.navigate([`./account/open-account/form-general`]);
  }

  goToFormJuristic() {
    this.router.navigate([`./account/open-account/form-juristic`]);
  }

  openRejectDetail(event, item) {
    console.log('item', item);
    if (item) {
      this.accountId = item.id;
      this.modal.open();
    }
  }

  goToEditFormGeneral(item, type) {

    console.log('event', item);
    if (type === 'Individual') {
      this.router.navigate([`./account/open-account/form-general/${item.id}`]);
    } else if (type === 'Juristic') {
      this.router.navigate([`./account/open-account/form-juristic`]);
    }
  }
}
