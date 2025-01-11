import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseFeatureGridComponent} from '@postnerd-core';
import {Subscription} from 'rxjs';
import { DividendService } from '@api';
import { DividendDTO } from '@model';
import {ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {FileSaverService} from 'ngx-filesaver';
import {ToastrService} from 'ngx-toastr';
import * as moment from "moment";

@Component({
  selector: 'fe-customer-dividend',
  templateUrl: './fe-customer-dividend.component.html',
  styleUrls: ['./fe-customer-dividend.component.scss']
})
export class FeCustomerDividendComponent extends BaseFeatureGridComponent<DividendDTO, any> implements OnInit, OnDestroy {

  @ViewChild('fundTpl', {static: true}) fundTpl: TemplateRef<any>;
  @ViewChild('accountTpl', {static: true}) accountTpl: TemplateRef<any>;

  dataSub: Subscription;
  fcnAccountId: string;
  sortData = 'paymentDate';
  direction = 'desc';

  constructor(
    private dividendService: DividendService,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fileSaverService: FileSaverService,
    private toastrService: ToastrService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fcnAccountId = this.route.snapshot.paramMap.get('fcnAccountId');
    if (this.fcnAccountId) {
      super.ngOnInit();
      this.getData();
    }

  }

  onExportFile() {
    this.spinner.show('global');

    const dataSub = this.dividendService.dividendExportReport$(
      undefined,
      this.sortData,
      this.direction,
      undefined,
      undefined,
      this.fcnAccountId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ).subscribe(res => {
      // console.log('res', res);
      this.fileSaverService.save((res), `dividend_report_${moment().format('DD-MM-YYYY')}.xlsx`);
      this.spinner.hide('global');
    });
  }

  filterChange(event) {
    this.page.page = 1;
    this.getData();
  }

  onSortChange(data) {
    this.sortData = data.sortBy;
    this.direction = data.asc ? 'asc' : 'desc';
    // console.log('this.sort', this.sortData);
    this.page.page = 1;
    this.getData();
  }


  protected setColumns() {
    this.columns = [
      {
        name: 'วันที่จ่ายปันผล',
        prop: 'paymentDate',
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTpl,
        sortBy: 'paymentDate',
      },
      {
        name: 'กองทุน',
        prop: 'fundCode',
        sortable: true,
        width: 140,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.fundTpl,
      },
      {
        name: 'วันที่ปิดสมุดทะเบียน',
        prop: 'bookClosedDate',
        sortable: true,
        width: 100,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTpl,
      },
      {
        name: 'หน่วยที่จ่ายปันผล',
        prop: 'unit',
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        width: 100,
        cellTemplate: this.grid.unitTpl,
        sortBy: 'unit',
        sortable: true,
      },
      {
        name: 'อัตราปันผล',
        prop: 'dividendRate',
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'dividendRate',
        sortable: true,
        width: 100,
        cellTemplate: this.grid.unitTpl,
      },
      {
        name: 'เงินปันผลจ่าย',
        prop: 'dividendAmount',
        width: 100,
        cellTemplate: this.grid.unitTpl,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'dividendAmount',
        sortable: true,
      },
      {
        name: 'หักภาษี',
        prop: 'withholdingTax',
        sortable: true,
        width: 100,
        cellClass: 'justify-content-center align-items-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.grid.decimalTpl,
      },
      {
        name: 'เงินปันผลสุทธิ',
        prop: 'dividendAmountNet',
        sortable: true,
        width: 100,
        cellClass: 'justify-content-center align-items-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.grid.decimalTpl,
      },
      {
        name: 'ธนาคารที่นำจ่ายเงินปันผล',
        prop: 'bankCode',
        sortable: true,
        width: 120,
        cellClass: 'justify-content-center align-items-center',
        headerClass: 'justify-content-center',
        sortBy: 'bankShortName',
        cellTemplate: this.accountTpl,
      },
    ];
  }

  protected getData() {

    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.dividendService.dividendListGet$(
      this.page.page,
      this.page.perPage,
      undefined,
      this.sortData,
      this.direction,
      undefined,
      undefined,
      this.fcnAccountId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ).subscribe( data => {
      this.rows = data.dividendReports;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
    });
  }

}
