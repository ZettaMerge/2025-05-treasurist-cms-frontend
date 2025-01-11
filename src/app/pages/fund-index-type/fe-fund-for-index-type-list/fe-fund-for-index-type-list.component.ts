import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FundIndexService, CheckPermissionService } from '@api';
import { PermissionEnum } from '@app/core/variables/permission.enum';
import { FundIndexTypeDTO, FundIndexDTO, IndexTypeDTO, CalculateIndexTransactionDTO } from '@model';
import { BaseFeatureGridComponent, GridTableColumn, ModalComponent, PnStorageService, PopupService } from '@postnerd-core';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LastSyncEnum } from 'src/app/api/constant';


interface FilterType {
  indexType: any;
  status: any;
  searchFund: any;
  amc: any;
  fund: any;
}


interface PropType extends FundIndexTypeDTO {
  'indexTypeId'?: string;
  'indexTypeIdsCustom'?: any;
  'fundCodeCustom'?: any;
}
@Component({
  selector: 'fe-fund-for-index-type-list',
  templateUrl: './fe-fund-for-index-type-list.component.html',
  styleUrls: ['./fe-fund-for-index-type-list.component.scss']
})
export class FeFundForIndexTypeListComponent extends BaseFeatureGridComponent<PropType, any> implements OnInit {

  @ViewChild('fundTpl', { static: true }) fundTpl: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;
  @ViewChild('navTpl', { static: true }) navTpl: TemplateRef<any>;
  @ViewChild('indexTypeIdTpl', { static: true }) indexTypeIdTpl: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('recalModal') recalModal: ModalComponent;

  filter: FilterType = { status: undefined } as FilterType;
  lastSyncData: CalculateIndexTransactionDTO = {} as CalculateIndexTransactionDTO;

  dataSub: Subscription;
  updateSub: Subscription;
  dropdownSub: Subscription;
  lastSyncSub: Subscription;

  canCreate: boolean;

  sortData = 'fundCode';
  direction = 'asc';

  lastSyncEnum = LastSyncEnum;

  statusList = [
    { value: undefined, label: 'All' },
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' }
  ];

  searchTextChange = _.debounce(
    () => {
      this.page.page = 1;
      this.getData();
    },
    1000,
    { leading: false, trailing: true }
  );

  indexTypeList: IndexTypeDTO[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private fundIndexService: FundIndexService,
    private popupService: PopupService,
    private toastrService: ToastrService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,

  ) {
    super();
  }

  ngOnInit(): void {

    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);

    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.IndexType).then(result => {
      if (result) {
        this.canCreate = result.canCreate;

      }
      console.log('this.canCreate', this.canCreate);
    });

    super.ngOnInit();
    this.getData();
    this.getIndexTypeDropdown();
    this.getLastSync();
  }


  getLastSync() {

    if (this.lastSyncSub) {

      this.lastSyncSub.unsubscribe();
    }

    this.lastSyncSub = this.fundIndexService.fundIndexLastCalculateIndexTransactionGet$().subscribe(data => {

      console.log('lastsyn....', data);
      this.lastSyncData = data;
    }, error => {


    })


  }


  onSync() {

    this.recalModal.open();

  }

  getCancelSync() {
    this.recalModal.close();
    this.getLastSync();

  }



  onSave() {
    this.recalModal.close();
    this.getLastSync();
  }

  getIndexTypeDropdown() {
    if (this.dropdownSub) {
      this.dropdownSub.unsubscribe();
    }

    this.dropdownSub = this.fundIndexService.fundIndexIndexTypeListGet$(
      'name',
      'asc',
      true,
      9999,
      undefined,
      1
    ).subscribe(data => {
      this.indexTypeList = data.indexTypes;

      this.indexTypeList.push({
        id: data.indexTypes.length,
        isActive: true,
        name: 'Uncategorised'
      })
    });

  }

  onStatusChange(item) {
    // this.filterStatus = event
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }

    this.popupService.confirm('อัพเดทสถานะ', `คุณต้องการอัพเดทสถานะเป็น "${item.isActive ? 'Active' : 'Inactive'}" ใช่หรือไม่ ?`).subscribe((res) => {
      if (res) {
        this.spinner.show('global');
        this.updateSub = this.fundIndexService.fundIndexPatch$(item.id).subscribe(fundRes => {
          this.spinner.hide();
          this.getData();
        })
      } else {
        this.spinner.hide('global');
        this.getData();
      }
    })

  }

  clearFilter() {
    this.filter = {
      indexType: undefined,
      status: undefined,
      searchFund: undefined,
      amc: undefined,
      fund: undefined

    } as FilterType

    this.page.page = 1;
    this.getData();
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
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.fundTpl,
      },
      {
        name: 'บลจ.',
        prop: 'amcCode',
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'Index Type',
        prop: 'indexTypeId',
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.indexTypeIdTpl,
      },
      {
        name: 'Nav / วันที่อัปเดต',
        prop: 'nav',
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.navTpl,
      },

    ];

  }

  protected getData() {
    this.spinner.show('global');



    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.fundIndexService.fundIndexTypeALlListGet$(
      this.page.page,
      this.page.perPage,
      this.filter?.amc?.amcCode,
      this.filter?.fund?.fundCode,
      this.filter.indexType ? this.filter.indexType?.name === 'Uncategorised' ? 'Uncategorised' : this.filter.indexType?.id : undefined,
      undefined,
      this.filter.searchFund,
      this.sortData,
      this.direction
    ).subscribe(data => {
      this.rows = data.list;
      this.page.totalCount = data.allRecord;
      this.spinner.hide('global');
      console.log('data', data);
    });

  }









}
