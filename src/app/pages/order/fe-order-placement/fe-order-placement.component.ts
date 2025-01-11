import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {BaseFeatureGridComponent, ModalComponent, PnStorageService, PopupService} from '@postnerd-core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import {CheckPermissionService, OrderService} from '@api';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderTransactionListDTO } from '@model';
import { FileSaverService } from 'ngx-filesaver';
import { debounce } from 'lodash';
import {PermissionEnum} from "@app/core/variables/permission.enum";

interface FilterType {
  search: string;
  amc: any;
  fund: any;
  status: any;
  orderType: any;
  payType: any;
  dateRange: Date[];
  transactionDateTime: Date;
}

@Component({
  selector: 'fe-order-placement',
  templateUrl: './fe-order-placement.component.html',
  styleUrls: ['./fe-order-placement.component.scss']
})
export class FeOrderPlacementComponent extends BaseFeatureGridComponent<OrderTransactionListDTO, any> implements OnInit, OnDestroy {

  @ViewChild('nameTpl', { static: true }) nameTpl: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;
  @ViewChild('countTpl', { static: true }) countTpl: TemplateRef<any>;
  @ViewChild('transactionIdTpl', { static: true }) transactionIdTpl: TemplateRef<any>;
  @ViewChild('namePort', { static: true }) namePort: TemplateRef<any>;
  @ViewChild('paymentTypeTpl', { static: true }) paymentTypeTpl: TemplateRef<any>;
  @ViewChild('orderTypeTpl', { static: true }) orderTypeTpl: TemplateRef<any>;
  @ViewChild('unitType', { static: true }) unitType: TemplateRef<any>;

  filter: FilterType = {} as FilterType;

  dataSub: Subscription;
  amcCode: string;
  fundCode: string;
  startDate: string;
  endDate: string;
  transactionDateTime: string;

  accountId: string;

  canExport: boolean;
  canView: boolean;
  canCreate: boolean;

  sortData = 'transactionDateTime';
  direction = 'desc';

  constructor(
    private spinner: NgxSpinnerService,
    private orderService: OrderService,
    private popupService: PopupService,
    private toastrService: ToastrService,
    private router: Router,
    protected route: ActivatedRoute,
    private fileSaverService: FileSaverService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
    super();
    this.searchTextChange = debounce(this.searchTextChange, 1000);
  }


  ngOnInit(): void {
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.OrderPlacement).then(result => {
      if (result) {
        this.canExport = result.canExport;
        this.canView = result.canView;
        this.canCreate = result.canCreate;
      }

      console.log('resulr', result);
    });

    this.sort = { prop: 'transactionDateTime', sortBy: 'transactionDateTime', asc: false };
    this.accountId = this.route.snapshot.paramMap.get('id');
    console.log('acc id', this.accountId);
    if (this.accountId) {
      this.filter.search = this.accountId;
      super.ngOnInit();
      this.getData();
    } else {
      super.ngOnInit();
      this.getData();
    }
  }

  filterChange(event) {
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
        cellTemplate: this.unitType,
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

  searchTextChange(event: string) {
    console.log('searchTextChange', event);
    this.page.page = 1;
    this.getData();
  }

  onSelectDateChange() {
    console.log('onSelectDateChange', this.filter.dateRange);
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
    const url = `order/order-placement/detail/${item.saOrderNoView}`;
    window.open(url, '_blank');
  }

  protected getData() {
    this.spinner.show('global');
    // this.rows = [];
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
      this.endDate || undefined,
      this.filter?.fund?.fundCode || undefined,
      this.filter?.search || undefined,
      this.page.perPage,
      this.page.page,
      this.filter.payType?.id || undefined,
      this.startDate || undefined,
      this.filter.status ? this.filter.status : undefined,
      this.transactionDateTime || undefined,
      this.filter?.orderType?.id || undefined,
      undefined,
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
      orderType: undefined,
      payType: undefined,
      transactionDateTime: undefined,
      dateRange: undefined,
    } as FilterType;
    this.startDate = undefined;
    this.endDate = undefined;
    this.transactionDateTime = undefined;
    this.amcCode = undefined;
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
      this.endDate || undefined,
      this.filter?.fund?.fundCode || undefined,
      this.filter?.search || undefined,
      this.filter.payType?.id || undefined,
      this.startDate || undefined,
      this.filter.status ? this.filter.status : undefined,
      this.transactionDateTime || undefined,
      this.filter?.orderType?.id || undefined,
      undefined,
    ).subscribe(res => {
      // console.log('res', res);
      this.fileSaverService.save((res), `order_placement_report_${moment().format('DD-MM-YYYY')}.xlsx`);
      this.spinner.hide('global');
    });
  }

  save() {
    this.modal.close();
    this.page.page = 1;
    this.getData();
  }
}
