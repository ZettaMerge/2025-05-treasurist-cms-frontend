import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseFeatureGridComponent, PnStorageService} from '@postnerd-core';
import {NgxSpinnerService} from 'ngx-spinner';
import {debounce} from 'lodash';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import {AuditRiskService, CheckPermissionService} from '@api';
import {AuditRiskDTO} from '@model';
import {FileSaverService} from 'ngx-filesaver';
import {PermissionEnum} from "@app/core/variables/permission.enum";

interface FilterType {
  search: string;
  dateRange?: Date[];
}


@Component({
  selector: 'fe-audit-risk-list',
  templateUrl: './fe-audit-risk-list.component.html',
  styleUrls: ['./fe-audit-risk-list.component.scss']
})
export class FeAuditRiskListComponent extends BaseFeatureGridComponent<AuditRiskDTO, any> implements OnInit {

  @ViewChild('accountIDTpl', {static: true}) accountIDTpl: TemplateRef<any>;
  @ViewChild('fundTpl', {static: true}) fundTpl: TemplateRef<any>;
  @ViewChild('acceptRiskTpl', {static: true}) acceptRiskTpl: TemplateRef<any>;

  dataSub: Subscription;
  startDate: string;
  endDate: string;

  canExport: boolean;

  sortData = 'transactionDateTime';
  direction = 'desc';

  constructor(
    private spinner: NgxSpinnerService,
    private auditRiskService: AuditRiskService,
    private fileSaverService: FileSaverService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
    super();
    this.searchTextChange = debounce(this.searchTextChange, 1000);
  }

  ngOnInit(): void {
    // CHECK PERMISSION
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.AuditRisk).then(result => {
      if (result) {
        this.canExport = result.canExport;
      }

      console.log('result', result);
    });

    super.ngOnInit();
    this.getData();
  }

  exportReport() {
    this.spinner.show('global');

    this.auditRiskService.auditRiskExportFileGet$(
      undefined,
      this.sortData,
      this.filter.search || undefined,
      this.direction,
      undefined,
      this.endDate,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.startDate,
    ).subscribe(res => {
      this.fileSaverService.save((res), `audit_risk_report.xlsx`);
      this.spinner.hide('global');
    });
  }

  searchTextChange(event: string) {
    this.page.page = 1;
    this.getData();
  }

  filterChange(event) {
    this.page.page = 1;
    this.getData();
  }

  onSelectDateChange() {
    this.startDate = this.filter.dateRange ? moment(this.filter.dateRange[0]).format('yyyy-MM-DD') : undefined;
    this.endDate = this.filter.dateRange ? moment(this.filter.dateRange[1]).format('yyyy-MM-DD') : undefined;
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
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTpl,
      },
      {
        name: 'Account ID',
        prop: 'fcnAccountId',
        width: 200,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.accountIDTpl
      },
      {
        name: 'กองทุน',
        prop: 'fundCode',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.fundTpl,
      },
      {
        name: 'ยินยอมรับความเสี่ยง',
        prop: 'abilityAndWillingnessToTakeRisk',
        width: 155,
        sortable: true,
        cellClass: 'align-items-center justify-content-center',
        headerClass: 'align-items-center',
        cellTemplate: this.acceptRiskTpl,
      },
      {
        name: 'จำนวนเงิน',
        prop: 'amount',
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.decimalTpl,
      },
      {
        name: 'จำนวนหน่วย',
        prop: 'unit',
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.unitTpl,
      },
      {
        name: 'ประเภทคำสั่ง',
        prop: 'transactionType',
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'วันที่ทำรายการ',
        prop: 'effectiveDate',
        width: 120,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTpl,
      },
    ];
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.auditRiskService.auditRiskListGet$(
      undefined,
      this.sortData,
      this.filter.search || undefined,
      this.direction,
       undefined,
      this.endDate,
      undefined,
      undefined,
      undefined,
      undefined,
      this.page.perPage,
      this.page.page,
      undefined,
      undefined,
       undefined,
      this.startDate,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ).subscribe(data => {
      this.rows = data.auditRisks;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
      console.log('data', data);
    });
  }

  clearFilter() {
    this.filter = {
      search: undefined,
      team: undefined,
      dateRange: undefined,
    } as FilterType;

    this.startDate = undefined;
    this.endDate = undefined;

    this.page.page = 1;
    this.getData();
  }


}
