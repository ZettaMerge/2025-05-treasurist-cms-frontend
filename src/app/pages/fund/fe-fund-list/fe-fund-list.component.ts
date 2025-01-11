import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseFeatureGridComponent, ModalComponent, PnStorageService, PopupService } from '@postnerd-core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FundListDTO } from '@model';
import { AssetService, CheckPermissionService, FundService } from '@api';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import * as moment from 'moment';
import { debounce } from 'lodash';
import { PermissionEnum } from "@app/core/variables/permission.enum";

interface FilterType {
  amc: any;
  fund: any;
  aimc: any;
  fundType: any;
  dividend: any;
  tax: any;
  fxRisk: any;
  searchFund: string;
}

@Component({
  selector: 'fe-fund-list',
  templateUrl: './fe-fund-list.component.html',
  styleUrls: ['./fe-fund-list.component.scss']
})
export class FeFundListComponent extends BaseFeatureGridComponent<FundListDTO> implements OnInit, OnDestroy {

  @ViewChild('fundTpl', { static: true }) fundTpl: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;
  @ViewChild('navTpl', { static: true }) navTpl: TemplateRef<any>;

  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('fundNavModal') fundNavModal: ModalComponent;
  @ViewChild('fundNameModal') fundNameModal: ModalComponent;

  canExport: boolean;
  canCreate: boolean;
  canView: boolean;

  typeList = [
    { value: undefined, label: 'All', valueType: undefined },
    { value: 'Y', label: 'ใช่', valueType: 'Y' },
    { value: 'N', label: 'ไม่ใช่', valueType: 'N' }
  ];

  fxRiskList = [
    { value: undefined, label: 'All' },
    { value: true, label: 'ใช่' },
    { value: false, label: 'ไม่ใช่' }
  ];

  dataSub: Subscription;

  filter: FilterType = {
    dividend: undefined,
    tax: undefined,
    fxRisk: undefined,
  } as FilterType;

  fundTypeList = [];
  lastManualSyncDate: string;

  sortData = 'aimcCategoryName';
  direction = 'desc';

  constructor(
    private router: Router,
    private fundService: FundService,
    private spinner: NgxSpinnerService,
    private assetService: AssetService,
    private popupService: PopupService,
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
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.FundData).then(result => {
      if (result) {
        this.canExport = result.canExport;
        this.canCreate = result.canCreate;
        this.canView = result.canView;
      }

      console.log('result', result);
    });

    super.ngOnInit();
    this.getData();
    this.getFundTypeDropdown();
  }

  getFundTypeDropdown() {
    this.assetService.assetTypeDropdownGet$().subscribe(data => {

      for (const fundType of data) {
        this.fundTypeList.push({ id: fundType.id, name: fundType.enFundType });
      }

      const fundTypeList = _.uniqBy(this.fundTypeList, 'name');
      this.fundTypeList = fundTypeList;
    });
  }

  onSync() {
    // this.popupService.confirm(`${file.fileType}`, `คุณต้องการลบ ${file.fileType} เวอร์ชันอัพเดทเมื่อวันที่ ${moment(file.createdDate).format('DD/MM/YYYY HH:mm')} หรือไม่ ?`, `danger`)
    this.popupService.confirm(`Manual sync`, `คุณต้องการ Manual sync เวอร์ชันล่าสุด หรือไม่`)
      .subscribe((data) => {

        if (data) {
          this.modal.open();
        }

      });
    // this.modal.open();
  }

  onSyncFundNav() {

    this.fundNavModal.open();

  }

  onUpdateFundName() {
    this.fundNameModal.open();

  }

  filterAmcChange(event) {
    console.log('evnt amc', event);
    if (event !== null) {
      this.page.page = 1;
      this.getData();
    } else {
      this.filter.fund = undefined;
      this.page.page = 1;
      this.getData();
    }
  }

  searchTextChange(event: string) {
    console.log('searchTextChange', event);
    this.page.page = 1;
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


  protected setColumns() {
    this.columns = [
      {
        name: 'กองทุน',
        prop: 'fundCode',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.fundTpl
      },
      {
        name: 'บลจ.',
        prop: 'amcCode',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'AIMC Category',
        prop: 'aimcCategoryName',
        width: 180,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'Fund Type',
        prop: 'enFundType',
        sortable: true,
        width: 80,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'NAV / วันที่อัปเดต',
        prop: 'nav',
        sortable: true,
        width: 120,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.navTpl,
        sortBy: 'nav'
      },
      {
        name: 'สถานะ',
        prop: 'isActive',
        sortable: true,
        width: 80,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.statusTpl
      },
      {
        name: '', prop: '_action',
        cellTemplate: this.grid.detailTpl,
        minWidth: 80, width: 100,
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

    this.dataSub = this.fundService.fundListGet$(
      this.filter.aimc?.aimcName,
      this.filter?.amc?.amcCode,
      undefined,
      this.filter?.dividend,
      this.filter?.fundType?.name,
      this.filter?.fund?.fundCode,
      this.filter?.fxRisk,
      this.page.page,
      undefined,
      undefined,
      undefined,
      this.filter.searchFund,
      this.page.perPage,
      this.direction,
      this.filter?.tax,
      this.sortData,
    ).subscribe(data => {
      this.rows = data.list;
      this.page.totalCount = data.allRecord;
      this.spinner.hide('global');
    });

    // last manual sync
    const lastManualSync = this.fundService.fundLastManualSyncGet$().subscribe(data => {
      console.log('lastManualSyncDate', data);
      this.lastManualSyncDate = data;
    });
  }

  detailInfo(item) {
    const url = `fund/detail/${item.id}`;
    window.open(url, '_blank');
  }

  onGetDataSync(event) {
    if (event) {
      this.page.page = 1;
      this.getData();
      this.modal.close();
    }
  }

  clearFilter() {
    this.filter = {
      dividend: undefined,
      tax: undefined,
      fxRisk: undefined,
      amc: undefined,
      fund: undefined,
      aimc: undefined,
      fundType: undefined,
      searchFund: undefined,
    } as FilterType;

    this.page.page = 1;
    this.getData();
  }


  saveFundNav() {
    this.page.page = 1;
    this.getData();
    this.fundNavModal.close();
  }

  saveFundName() {
    this.page.page = 1;
    this.getData();
    this.fundNameModal.close();
  }

}
