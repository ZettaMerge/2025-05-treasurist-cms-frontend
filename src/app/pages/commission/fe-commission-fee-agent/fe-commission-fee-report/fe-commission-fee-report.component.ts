import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseFeatureGridComponent, PnStorageService} from '@postnerd-core';
import {AgentCommissionFeesListDTO, PaymentTermDTO} from '@model';
import {NgxSpinnerService} from 'ngx-spinner';
import {CommissionFeeService} from '@api';
import * as moment from 'moment';
import * as _ from 'lodash';

interface FilterType {
  search: string;
  team: any;
  date: any;
}


@Component({
  selector: 'fe-commission-fee-report',
  templateUrl: './fe-commission-fee-report.component.html',
  styleUrls: ['./fe-commission-fee-report.component.scss']
})
export class FeCommissionFeeReportComponent extends BaseFeatureGridComponent<AgentCommissionFeesListDTO, any> implements OnInit {

  @ViewChild('descriptionTpl', {static: true}) descriptionTpl: TemplateRef<any>;
  @ViewChild('statusTpl', {static: true}) statusTpl: TemplateRef<any>;

  filter: FilterType = {} as FilterType;
  dataSub: Subscription;

  paymentData: PaymentTermDTO = {} as PaymentTermDTO;

  paymentTermId: any;
  agentId: any;
  type: any;
  icLicense: any;

  status = 'DRAFT';
  sortData = 'accountName';
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
    this.paymentTermId = this.route.snapshot.paramMap.get('paymentTermId');
    this.agentId = this.route.snapshot.paramMap.get('agentId');
    this.type = this.route.snapshot.paramMap.get('type');
    this.icLicense = this.route.snapshot.paramMap.get('icLicense');

    if (this.paymentTermId) {
      this.getById();
      super.ngOnInit();
      this.getData();
    }

  }

  getById() {
    this.spinner.show('global');
    this.commissionFeeService.agentCommissionPaymentTermsGet$(
      _.toNumber(this.paymentTermId)
    ).subscribe(
      data => {
        this.paymentData = data;
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
    this.router.navigate([`./commission/commission-fee/report/${this.agentId}`]);

  }

  detailInfo(item) {
    console.log('detailInfo', item);

  }

  protected setColumns() {
    this.columns = [
      {
        name: 'กองทุน',
        prop: 'fundCode',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'บลจ.',
        prop: 'amcCode',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center text-wrap',
        headerClass: 'align-items-center',
      },
      {
        name: 'Agent Fee',
        prop: 'agentFee',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.decimalTpl
      },
      {
        name: 'Account Name',
        prop: 'accountName',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'Account ID',
        prop: 'accountId',
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
    ];
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.commissionFeeService.agentCommissionReportByFeeListGet$(
      this.icLicense,
      this.page.page,
      this.page.perPage,
      _.toNumber(this.paymentTermId),
      this.type,
      this.sortData,
      this.direction,
    ).subscribe(data => {
      this.rows = data.agentCommissionFees;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
    });


  }

}
