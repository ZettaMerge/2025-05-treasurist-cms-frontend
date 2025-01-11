import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseFeatureGridComponent, PnStorageService} from '@postnerd-core';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {debounce} from 'lodash';
import {CheckPermissionService, CommissionFeeService} from '@api';
import {IncentiveRateDTO} from '@model';
import * as moment from "moment";
import {FileSaverService} from "ngx-filesaver";
import {ToastrService} from "ngx-toastr";
import {PermissionEnum} from "@app/core/variables/permission.enum";

interface FilterType {
  fundCode: string;
  amcCode: string;
  status: string;

}

@Component({
  selector: 'fe-commission-tsr-intensive-rate',
  templateUrl: './fe-commission-tsr-intensive-rate.component.html',
  styleUrls: ['./fe-commission-tsr-intensive-rate.component.scss']
})
export class FeCommissionTsrIntensiveRateComponent extends BaseFeatureGridComponent<IncentiveRateDTO, any> implements OnInit {
  @ViewChild('statusTpl', {static: true}) statusTpl: TemplateRef<any>;
  @ViewChild('rateTpl', {static: true}) rateTpl: TemplateRef<any>;
  @ViewChild('amcFETpl', {static: true}) amcFETpl: TemplateRef<any>;
  @ViewChild('tsrFeIncentiveReteTpl', {static: true}) tsrFeIncentiveReteTpl: TemplateRef<any>;
  @ViewChild('tsrFeFinalReteTpl', {static: true}) tsrFeFinalReteTpl: TemplateRef<any>;
  @ViewChild('amcMgmtTpl', {static: true}) amcMgmtTpl: TemplateRef<any>;
  @ViewChild('tsrTrIncentiveReteTpl', {static: true}) tsrTrIncentiveReteTpl: TemplateRef<any>;
  @ViewChild('tsrTrFinalReteTpl', {static: true}) tsrTrFinalReteTpl: TemplateRef<any>;
  lists = [
    {id: 1, name: 'ACTIVE'},
    {id: 2, name: 'INACTIVE'},
  ];

  dataSub: Subscription;
  sortData = 'amcCode';
  direction = 'asc';
  fileIncentiveRate;
  canExport: boolean;
  canView: boolean;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private  commissionFeeService: CommissionFeeService,
    private fileSaverService: FileSaverService,
    private toastrService: ToastrService,
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
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.CommissionTSRIncentiveRate).then(result => {
      if (result) {
        this.canView = result.canView;
        this.canExport = result.canExport;
      }
      console.log('this.canView', this.canView);
      console.log('this.canExport', this.canExport);
    });
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

  searchTextChange(event: string) {
    this.page.page = 1;
    this.getData();
  }

  filterAmcChange(event) {
    console.log('event', event);
    this.page.page = 1;
    this.getData();
  }

  protected setColumns() {
    this.columns = [
      {
        name: 'AMC',
        prop: 'amcCode',
        width: 150,
        sortable: true,
      },
      {
        name: 'Fund Code',
        prop: 'fundCode',
        width: 150,
        sortable: true,
      },
      {
        name: 'AMC FE',
        prop: 'amcFe',
        cellTemplate: this.amcFETpl,
        sortable: true,
      },
      {
        name: 'TSR-FE Incentive Rate',
        prop: 'tsrFeIncentiveRate',
        cellTemplate: this.tsrFeIncentiveReteTpl,
        sortable: true,
      },
      {
        name: 'TSR-FE Final Rate',
        prop: 'tsrFeFinalRate',
        cellTemplate: this.tsrFeFinalReteTpl,
        sortable: true,
      },
      {
        name: 'AMC Mgmt.',
        prop: 'amcMgmt',
        cellTemplate: this.amcMgmtTpl,
        sortable: true,
      },
      {
        name: 'TSR-TR Incentive Rate',
        prop: 'tsrTrIncentiveRate',
        cellTemplate: this.tsrTrIncentiveReteTpl,
        sortable: true,
      },
      {
        name: 'TSR-TR Final Rate',
        prop: 'tsrTrFinalRate',
        cellTemplate: this.tsrTrFinalReteTpl,
        sortable: true,
      },

    ];
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.commissionFeeService.incentiveRatesGet$(
      this.page.page,
      this.page.perPage,
      this.filter?.amcCode?.amcCode || undefined,
      this.sortData,
      this.direction,
      this.filter?.fundCode || undefined,
      undefined,
    ).subscribe(data => {
      this.rows = data.incentiveRates;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');

    });
  }

  clearFilter() {
    this.filter = {
      fundCode: undefined,
      amcCode: undefined,
      status: undefined,
    } as FilterType;
    this.page.page = 1;
    this.getData();
  }

  exportReport() {

    this.spinner.show('global');
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.commissionFeeService.incentiveRatesExportExcelGet$(
      this.filter?.amcCode?.amcCode || undefined,
      this.sortData,
      this.direction,
      this.filter?.fundCode || undefined,
      undefined,
    ).subscribe(res => {
      this.fileSaverService.save((res), `tsr_incentive_rate_report.xlsx`);
      this.spinner.hide('global');
    });

  }

  onChangeFileImport(event) {
    console.log('event', event.type);
    console.log('event', event);
    this.spinner.show('global');

    const fileType = event.target.files[0].type;
    if (event.target && fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.spinner.hide('global');
      this.toastrService.error('ไฟล์ Upload ต้องเป็น .xlsx เท่านั้น');
      this.fileIncentiveRate = undefined;
    } else {
      this.fileIncentiveRate = event.target.files[0];
      console.log('fileFrontEndCoverFile', this.fileIncentiveRate);
      const reader = new FileReader();
      reader.onload = (e) => {
      };
      reader.readAsDataURL(this.fileIncentiveRate);

      if (this.fileIncentiveRate) {
        this.commissionFeeService.incentiveRatesImportPost$(this.fileIncentiveRate).subscribe(
          res => {
            this.spinner.hide('global');
            this.toastrService.success('Import Success');
            this.getData();
          });
      }
    }

    // if (event && event?.target?.files?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    //   this.toastrService.error('ไฟล์ Upload ต้องเป็น .xlsx เท่านั้น');
    //   this.fileIncentiveRate = undefined;
    // } else {
    //   this.fileIncentiveRate = event;
    //
    //   console.log(' this.fileCoverFile', this.fileIncentiveRate);
    // }
  }
}
