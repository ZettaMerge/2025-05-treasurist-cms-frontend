import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseFeatureGridComponent, PnStorageService} from '@postnerd-core';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {CheckPermissionService, CommissionFeeService} from "@api";
import {PaymentTermDTO} from "@model";
import * as moment from 'moment';
import * as _ from 'lodash';
import {FileSaverService} from "ngx-filesaver";
import {PermissionEnum} from "@app/core/variables/permission.enum";


interface FilterType {
  paymentDate: Date;
  status: any;

}

@Component({
  selector: 'fe-commission-fee-payment',
  templateUrl: './fe-commission-fee-payment.component.html',
  styleUrls: ['./fe-commission-fee-payment.component.scss']
})
export class FeCommissionFeePaymentComponent extends BaseFeatureGridComponent<PaymentTermDTO, any> implements OnInit {

  @ViewChild('descriptionTpl', {static: true}) descriptionTpl: TemplateRef<any>;
  @ViewChild('totalTpl', {static: true}) totalTpl: TemplateRef<any>;
  @ViewChild('tarFeeTpl', {static: true}) tarFeeTpl: TemplateRef<any>;
  @ViewChild('agentFeeTpl', {static: true}) agentFeeTpl: TemplateRef<any>;
  @ViewChild('statusTpl', {static: true}) statusTpl: TemplateRef<any>;
  @ViewChild('actionTpl', {static: true}) actionTpl: TemplateRef<any>;

  filter: FilterType = {} as FilterType;
  dataSub: Subscription;

  canView: boolean;
  canCreate: boolean;
  canExport: boolean;

  lists = [
    {id: 1, name: 'DRAFT'},
    {id: 2, name: 'PUBLISHED'},
  ];

  sortData = 'paymentDate';
  direction = 'desc';

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private commissionFeeService: CommissionFeeService,
    private fileSaverService: FileSaverService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
    super();
  }

  ngOnInit(): void {
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.CommissionPayment).then(result => {
      if (result) {
        this.canView = result.canView;
        this.canCreate = result.canCreate;
        this.canExport = result.canExport;
      }
    });
    super.ngOnInit();
    this.getData();
  }

  add() {
    const url = `commission/payment/new`;
    window.open(url, '_blank');
  }

  filterChange(item) {
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
        name: 'Payment Date',
        prop: 'paymentDate',
        width: 100,
        sortable: true,
        cellTemplate: this.grid.dateTpl
      },
      {
        name: 'Description',
        prop: 'description',
        width: 250,
        cellClass: 'text-wrap',
        sortable: true,
      },
      {
        name: 'Total',
        prop: 'total',
        sortable: true,
        cellTemplate: this.totalTpl,

      },
      {
        name: 'TSR Fee',
        prop: 'tsrFee',
        sortable: true,
        cellTemplate: this.tarFeeTpl,

      },
      {
        name: 'Agent Fee',
        prop: 'agentFee',
        sortable: true,
        cellTemplate: this.agentFeeTpl,

      },
      {
        name: 'สถานะ',
        prop: 'status',
        width: 100,
        sortable: true,
        cellTemplate: this.statusTpl,
      },
      {
        name: '', prop: '_action',
        cellTemplate: this.actionTpl,
        width: 200,
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

    this.dataSub = this.commissionFeeService.paymentTermsGet$(
      this.page.page,
      this.page.perPage,
      this.sortData,
      this.direction,
      this.filter?.paymentDate ? moment(this.filter?.paymentDate).format('yyyy-MM-DD') : undefined,
      this.filter?.status?.name || undefined,
    ).subscribe(data => {
      this.rows = data.paymentTerms;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
    });

  }

  clearFilter() {
    this.filter = {
      paymentDate: undefined,
      status: undefined,
    } as FilterType;
    this.page.page = 1;
    this.getData();
  }

  onExport(item) {
    this.spinner.show('global');
    this.commissionFeeService.paymentTermsExportExcelCommissionFeeGet$(item.id).subscribe(
      res => {
        this.fileSaverService.save((res), `commission_report.xlsx`);
        this.spinner.hide('global');
      });
  }

  detailInfo(item) {
    console.log('item', item);
    const url = `commission/payment/${item.id}`;
    window.open(url, '_blank');
  }
}
