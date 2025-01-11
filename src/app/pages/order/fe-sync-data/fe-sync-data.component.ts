import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService, CheckPermissionService, CustomerService, AccountService } from '@api';
import { PermissionEnum } from '@app/core/variables/permission.enum';
import { PopupService } from '@ng-bootstrap/ng-bootstrap/util/popup';
import { BaseFeatureGridComponent, ModalComponent, PnStorageService } from '@postnerd-core';
import moment from 'moment';
import { FileSaverService } from 'ngx-filesaver';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { debounce } from 'rxjs/operators';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';

interface FilterType {
  search: string;
  amc: any;
  fund: any;
  status: any;
  statuses: any;
  orderType: any;
  payType: any;
  customerData: any;
  fundPlan: any;
  dateRange: Date[];
  transactionDateTime: Date;
}

@Component({
  selector: 'fe-sync-data',
  templateUrl: './fe-sync-data.component.html',
  styleUrls: ['./fe-sync-data.component.scss']
})
export class FeSyncDataComponent extends BaseFeatureGridComponent<any> implements OnInit, OnDestroy, OnChanges {

  @ViewChild('nameTpl', { static: true }) nameTpl: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;
  @ViewChild('countTpl', { static: true }) countTpl: TemplateRef<any>;
  @ViewChild('transactionIdTpl', { static: true }) transactionIdTpl: TemplateRef<any>;
  @ViewChild('namePort', { static: true }) namePort: TemplateRef<any>;
  @ViewChild('paymentTypeTpl', { static: true }) paymentTypeTpl: TemplateRef<any>;
  @ViewChild('orderTypeTpl', { static: true }) orderTypeTpl: TemplateRef<any>;
  @ViewChild('unitTpl', { static: true }) unitTpl: TemplateRef<any>;


  @ViewChild('modal') modal: ModalComponent;
  filter: FilterType = {} as FilterType;

  dataSub: Subscription;
  amcCode: string;
  fundCode: string;
  startDate: string;
  endDate: string;
  transactionDateTime: string;
  canExport: boolean;

  accountId: string;
  mode: string;

  sortData = 'transactionDateTime';
  direction = 'desc';

  listsFundPlanDropdown;
  listsCustomerDropdown;
  customerData: any;
  fundPlan: any;
  customerId: number;
  fundAccount: any;

  isShowSync = true;
  isShowSuccess = false;
  isShowFailed = false;

  lastManualSyncDate: string;

  isValidateCustomer: boolean;
  isValidateFundPlan: boolean;
  isValidateEffectDate: boolean;

  searchTextChange = _.debounce(
    () => {
      this.page.page = 1;
      this.getData();
    },
    1000,
    { leading: false, trailing: true }
  );

  constructor(
    private spinner: NgxSpinnerService,
    private orderService: OrderService,
    private toastrService: ToastrService,
    private router: Router,
    protected route: ActivatedRoute,
    private fileSaverService: FileSaverService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
    private customerService: CustomerService,
    private accountService: AccountService,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnInit(): void {

    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.OrderTransaction).then(result => {
      if (result) {
        this.canExport = result.canExport;
      }
    });

    this.sort = { prop: 'transactionDateTime', sortBy: 'transactionDateTime', asc: false };
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.mode = this.route.snapshot.paramMap.get('mode');

    if (this.accountId) {
      // กดมาจาก หน้า customer
      this.filter.search = this.accountId;

      if (this.mode === 'submitted') {
        this.filter.statuses = ['SUBMITTED'];
      } else if (this.mode === 'all') {
        this.filter.statuses = ['ALLOTTED', 'APPROVED', 'CANCELLED', 'EXPIRED', 'REJECTED', 'WAITING'];
      }

      super.ngOnInit();
      this.getData();
    } else {
      super.ngOnInit();
      this.getData();
    }

    this.getCustomerDropdown();
  }

  filterChange(event) {
    console.log('event', event);
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

  getCustomerDropdown() {
    this.customerService.customerDropdownGet$().subscribe(data => {
      console.log('getCustomerDropdown', data);
      // const fundPlansId = data.fundPlansId;
      this.listsCustomerDropdown = [];
      if (data) {
        data.forEach(c => {
          // ${ c.accountId }
          this.listsCustomerDropdown.push({ id: c.userId, name: `${c.thFirstname} ${c.thLastname}`, vulnerableFlag: c.vulnerableFlag });
        });
      }
    });
  }

  getFundPlan() {
    // this.customerId = 177;
    // this.listsFundPlanDropdown = [];
    this.customerService.customerIdInfoGet$(_.toNumber(this.customerId)).subscribe(data => {
        // console.log('customerIdInfoGet', data.fundPlans);
        const fundPlansId = data.fundPlans;
        this.listsFundPlanDropdown = [];
        if (fundPlansId) {
          fundPlansId.forEach(p => {
            this.listsFundPlanDropdown.push({ id: p.id, name: `${p.fcnAccountId} - ${p.name}`, fcnAccountId: p.fcnAccountId });
          });
        }

      });
  }

  onChangeNameCustomer(event, customerData) {
    console.log('onChangeNameCustomer', customerData);
    this.customerId = event ? event?.id : null;
    this.fundPlan = undefined;
    this.fundAccount = undefined;

    if (event) {
      this.getFundPlan();
    } else {
      this.page.page = 1;
      this.getData();
    }


  }

  onChangeFundPlan(event) {
    console.log('event', event);
    this.fundAccount = event;
    this.page.page = 1;
    this.getData();
  }

  protected setColumns() {
    this.columns = [
      {
        name: 'วันที่ส่งคำสั่ง',
        prop: 'transactionDateTime',
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        width: 140,
        cellTemplate: this.grid.dateNumberTpl,
        sortBy: 'transactionDateTime',
      },
      {
        name: 'กองทุน',
        prop: 'fundCode',
        width: 180,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.namePort,
        sortBy: 'fundCode',
      },
      {
        name: 'บลจ.',
        prop: 'amcCode',
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        width: 100,
        sortBy: 'amcCode',
      },
      {
        name: 'Account ID',
        prop: 'fcnAccountId',
        width: 200,
        cellTemplate: this.nameTpl,
        sortBy: 'fcnAccountId'
      },
      {
        name: 'จำนวนเงิน',
        prop: 'allottedAmount',
        headerClass: 'align-items-center',
        width: 120,
        cellTemplate: this.countTpl,
        sortBy: 'allottedAmount',
      },
      {
        name: 'จำนวนหน่วย',
        prop: 'allottedUnit',
        headerClass: 'align-items-center',
        width: 120,
        cellTemplate: this.unitTpl,
        sortBy: 'allottedUnit',
      },
      {
        name: 'ประเภทคำสั่ง',
        prop: 'transactionType',
        width: 140,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.orderTypeTpl,
        sortBy: 'transactionType',
      },
      {
        name: 'วันที่ทำรายการ',
        prop: 'effectiveDate',
        width: 150,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.grid.dateNumberTpl,
        sortBy: 'effectiveDate',
      },
      {
        name: 'สถานะ',
        prop: 'status',
        width: 120,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.statusTpl,
        sortBy: 'status',
      },
      {
        name: '', prop: '_action',
        cellTemplate: this.grid.detailTpl,
        minWidth: 100, width: 100,
        sortable: false,
        canAutoResize: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
    ];
  }

  onSelectDateChange() {
    console.log('onSelectDateChange', this.filter.dateRange);
    this.isValidateEffectDate = false;
    this.startDate = this.filter.dateRange ? moment(this.filter.dateRange[0]).format('yyyy-MM-DD') : undefined;
    this.endDate = this.filter.dateRange ? moment(this.filter.dateRange[1]).format('yyyy-MM-DD') : undefined;
    this.getData();
  }

  onTransactionDateTime(event) {
    console.log('onTransactionDateTime', event);
    this.transactionDateTime = event ? moment(event).format('yyyy-MM-DD') : undefined;
    this.getData();
  }


  transactionDetail(item) {
    const url = `order/transaction/detail/${item.saOrderNoView}`;
    window.open(url, '_blank');
    console.log('item', item);
  }

  protected getData() {
    this.spinner.show('global');

    console.log('this.filter.payType', this.filter.payType);
    console.log('this.filter.orderType', this.filter.orderType);
    console.log('this.filter.status', this.filter.status);

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.orderService.orderTransactionListGet$(
      this.filter?.amc?.amcCode || undefined,
      this.sortData,
      this.direction,
      this.filter.dateRange ? moment(this.filter.dateRange[1]).format('yyyy-MM-DD') : undefined,
      this.filter?.fund?.fundCode || undefined,
      this.fundAccount ? this.fundAccount?.fcnAccountId : undefined,
      this.page.perPage,
      this.page.page,
      this.filter.payType?.id || undefined,
      this.filter.dateRange ? moment(this.filter.dateRange[0]).format('yyyy-MM-DD') : undefined,
      this.filter.status ? this.filter.status : undefined,
      this.transactionDateTime || undefined,
      this.filter?.orderType?.id || undefined,
      undefined,
      this.filter.statuses ? this.filter.statuses : undefined,
    ).subscribe((data) => {
      this.rows = data.orderTransactions;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
      console.log('data.totalContent', this.rows);
    });

  }


  clearFilter() {
    this.filter = {
      search: undefined,
      amc: undefined,
      fund: undefined,
      status: undefined,
      statuses: undefined,
      orderType: undefined,
      payType: undefined,
      transactionDateTime: undefined,
      dateRange: undefined,
    } as FilterType;
    this.startDate = undefined;
    this.endDate = undefined;
    this.transactionDateTime = undefined;
    this.amcCode = undefined;
    this.customerData = undefined;
    this.fundPlan = undefined;
    this.fundAccount = undefined;
    this.isValidateCustomer = false;
    this.isValidateFundPlan = false;
    this.isValidateEffectDate = false;
    this.getData();
  }

  exportReport() {
    this.spinner.show('global');
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
    this.dataSub = this.orderService.orderTransactionExportReport$(
      this.filter?.amc?.amcCode || undefined,
      this.sortData,
      this.direction,
      this.filter.dateRange ? moment(this.filter.dateRange[1]).format('yyyy-MM-DD') : undefined,
      this.filter?.fund?.fundCode || undefined,
      this.fundAccount ? this.fundAccount?.fcnAccountId : undefined,
      this.filter.payType?.id || undefined,
      this.filter.dateRange ? moment(this.filter.dateRange[0]).format('yyyy-MM-DD') : undefined,
      this.filter.status ? this.filter.status : undefined,
      this.transactionDateTime || undefined,
      this.filter?.orderType?.id || undefined,
      undefined,
      this.filter.statuses ? this.filter.statuses : undefined,
    ).subscribe(res => {
      // console.log('res', res);
      this.fileSaverService.save((res), `order_transaction_report_${moment().format('DD-MM-YYYY')}.xlsx`);
      this.spinner.hide('global');
    });
  }

  onSyncTransaction(form: NgForm) {
    this.isValidateCustomer = false;
    this.isValidateFundPlan = false;
    this.isValidateEffectDate = false;

    if (!this.customerData) {
      this.isValidateCustomer = true;
    }

    if (!this.fundPlan) {
      this.isValidateFundPlan = true;
    }

    if (!this.filter.dateRange) {
      this.isValidateEffectDate = true;
    }

    if (this.isValidateCustomer || this.isValidateFundPlan || this.isValidateEffectDate) {
      console.log('กรอกข้อมูลให้ครบถ้วน');
      return;
    } else {
      this.modal.open();
    }

  }

  onGetDataSync() {

    this.modal.close();
    this.getData();

  }
}
