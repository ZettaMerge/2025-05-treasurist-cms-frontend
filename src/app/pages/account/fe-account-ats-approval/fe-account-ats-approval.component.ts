import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseFeatureGridComponent, ModalComponent, PopupService} from '@postnerd-core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AccountService} from '@api';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AccountDTO} from '@model';
import {debounce} from 'lodash';
import * as _ from 'lodash';
import * as moment from 'moment';

interface FilterType {
  search: string;
  dateRange?: Date[];
  approval: any;
  icLicense: any;
}

@Component({
  selector: 'fe-account-ats-approval',
  templateUrl: './fe-account-ats-approval.component.html',
  styleUrls: ['./fe-account-ats-approval.component.scss']
})
export class FeAccountAtsApprovalComponent extends BaseFeatureGridComponent<AccountDTO, any> implements OnInit, OnDestroy {

  @ViewChild('nameTpl', {static: true}) nameTpl: TemplateRef<any>;
  @ViewChild('accountTpl', {static: true}) accountTpl: TemplateRef<any>;
  @ViewChild('bankAccountTpl', {static: true}) bankAccountTpl: TemplateRef<any>;
  @ViewChild('countTpl', {static: true}) countTpl: TemplateRef<any>;
  @ViewChild('dateTpl', {static: true}) dateTpl: TemplateRef<any>;
  @ViewChild('accountType', {static: true}) accountType: TemplateRef<any>;
  @ViewChild('phoneTpl', {static: true}) phoneTpl: TemplateRef<any>;
  @ViewChild('icLicenseTpl', {static: true}) icLicenseTpl: TemplateRef<any>;
  @ViewChild('rejectDetailModal') rejectDetailModal: ModalComponent;

  statusApproval: string;
  customerType: string;
  accountId: number;


  filter: FilterType = {} as FilterType;

  dataSub: Subscription;

  sortData = 'fcnAccountId';
  direction = 'desc';

  typeCustomerlists = [
    {label: 'All', value: undefined},
    {label: 'General', value: 'Individual'},
    {label: 'Juristic', value: 'Juristic'},
  ];


  statusApprovalList = [
    {value: undefined, label: 'All'},
    {value: 'Pending', label: 'Pending Approval'},
    {value: 'Approved', label: 'Approved'}
  ];

  juristic = false;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private popupService: PopupService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
  ) {
    super();
    this.searchTextChange = debounce(this.searchTextChange, 1000);
  }

  ngOnInit(): void {
    super.ngOnInit();
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


  searchTextChange(event: string) {
    console.log('searchTextChange', event);
    this.page.page = 1;
    this.getData();
  }

  protected setColumns() {
    this.columns = [
      {
        name: 'Account ID',
        prop: 'fcnAccountId',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.nameTpl,
      },
      {
        name: 'เบอร์โทร/อีเมล',
        prop: 'mobileNumber',
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.phoneTpl,
      },
      {
        name: 'IC License',
        prop: 'icLicense',
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.icLicenseTpl,
      },
      {
        name: 'ประเภท/วันที่เปิดบัญชี',
        prop: 'accountType',
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.accountType,
      },
      {
        name: 'สถานะการ Approve',
        prop: 'accountStatus',
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.accountTpl,
      },
    ];
  }

  delete(item) {
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.accountService.accountListGet$(
      this.statusApproval === undefined ? ['Pending', 'Approved'] : [this.statusApproval],
      this.customerType,
      undefined,
      this.filter.dateRange ? moment(this.filter.dateRange[1]).format('yyyy-MM-DD') : undefined,
      this.page.page,
      this.page.perPage,
      this.filter.dateRange ? moment(this.filter.dateRange[0]).format('yyyy-MM-DD') : undefined,
      this.filter.search,
      this.sortData,
      this.direction
    ).subscribe((data) => {
      this.rows = data.accounts;
      this.page.totalCount = data.pagination.allRecord;
      // this.page.page = data.pagination.page;
      this.spinner.hide('global');
      console.log('accountService', this.rows);

    });
  }

  clearFilter() {
    this.filter = {
      search: undefined,
      dateRange: undefined,
      approval: undefined,
    } as FilterType;

    this.customerType = undefined;
    this.statusApproval = undefined;

    this.page.page = 1;
    this.getData();
  }

  accountDetail(item) {
    // if (item.accountType === 'Individual') {
    if (item && item.accountType === 'Individual') {
      console.log('Individual');
      this.router.navigate([`./account/account-ats-approval/account-detail/${item.id}`]);
    } else {
      this.router.navigate([`./account/account-ats-approval/account-detail/legal/${item.id}`]);
    }
  }


  bankAccDetail(item) {
    this.router.navigate([`./account/account-ats-approval/bank-account-detail`]);
  }

  goToRejectDetail(event, item) {
    console.log('reject open');
    if (item) {
      this.accountId = item.id;
      this.rejectDetailModal.open();
    }

  }

}
