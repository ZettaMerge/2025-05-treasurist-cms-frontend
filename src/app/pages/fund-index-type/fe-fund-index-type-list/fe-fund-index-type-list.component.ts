import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseFeatureGridComponent, GridTableColumn, PnStorageService, PopupService } from '@postnerd-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { CheckPermissionService, FundIndexService } from '@api';
import { FundIndexDTO, FundIndexTypeDTO, IndexTypeDTO } from '@model';
import { ToastrService } from 'ngx-toastr';
import { PermissionEnum } from '@app/core/variables/permission.enum';

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

interface FundIndexCustomDTO extends FundIndexDTO {
  indexTypeIdsCustom?: any[];
  fundCodeCustom?: any;
}

@Component({
  selector: 'fe-fund-index-type-list',
  templateUrl: './fe-fund-index-type-list.component.html',
  styleUrls: ['./fe-fund-index-type-list.component.scss']
})
export class FeFundIndexTypeListComponent extends BaseFeatureGridComponent<PropType, any> implements OnInit {

  @ViewChild('fundTpl', { static: true }) fundTpl: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;
  @ViewChild('navTpl', { static: true }) navTpl: TemplateRef<any>;
  @ViewChild('indexTypeIdTpl', { static: true }) indexTypeIdTpl: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  filter: FilterType = { status: undefined } as FilterType;

  fundIndexData: FundIndexCustomDTO = {} as FundIndexCustomDTO;


  dataSub: Subscription;
  updateSub: Subscription;
  dropdownSub: Subscription;

  canCreate: boolean;

  sortData = 'fundCode';
  direction = 'asc';

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
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.FundIndex).then(result => {
      if (result) {
        this.canCreate = result.canCreate;
        this.setColumns();
      }
      console.log('this.canCreate', this.canCreate);
    });
    super.ngOnInit();
    this.getData();
    this.getIndexTypeDropdown();
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

  goToCreate() {
    this.modal.open();
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
    const temp = [
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
        sortable: true,
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
      {
        name: 'สถานะ',
        prop: 'isActive',
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.statusTpl
      },
    ] as GridTableColumn<PropType>[];

    if (this.canCreate) {
      temp.push(
        {
          name: '',
          prop: '_action',
          cellTemplate: this.actionTpl,
          minWidth: 120, width: 180,
          sortable: false,
          canAutoResize: false,
          headerClass: 'justify-content-center',
          cellClass: 'justify-content-center'
        },);
    }

    this.columns = temp;
  }

  protected getData() {
    this.spinner.show('global');



    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.fundIndexService.fundIndexTypeListGet$(
      this.page.page,
      this.page.perPage,
      this.filter?.amc?.amcCode,
      this.filter?.fund?.fundCode,
      this.filter.indexType ? this.filter.indexType?.id : undefined,
      this.filter.status,
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

  onCreate() {
    this.isNew = true;
    this.fundIndexData = {} as FundIndexCustomDTO;
    this.modal.open();
  }

  onEdit(item) {
    console.log('onEdit', item);
    this.isNew = false;

    this.fundIndexData.fundCodeCustom = item.fundCode;
    this.fundIndexService.fundIndexByFundCodeGet$(item.fundCode).subscribe((data) => {
      // set data
      let fundIndex: any = data;
      let indexType: any[] = []
      let findData: any;
      for (let indexTypeId of fundIndex.indexTypeIds) {

        findData = _.find(this.indexTypeList, (index) => index.id === indexTypeId);
        indexType.push(findData);
      }
      this.fundIndexData.indexTypeIdsCustom = indexType;
      this.modal.open();
      console.log('get databy fundcode', this.fundIndexData);
    })


  }

  onSave() {

    this.modal.close();
    this.fundIndexData = {} as FundIndexCustomDTO;
    this.page.page = 1;
    this.getData();
  }

  onCancel() {
    this.modal.close();
    this.fundIndexData = {} as FundIndexCustomDTO;
  }

  onDelete(item) {
    console.log('item', item);
    this.popupService.confirmDelete(`${item.fundCode}  ${item.indexTypeName}`)
      .subscribe((res) => {
        if (res) {
          this.spinner.show('global');
          this.fundIndexService.fundIndexDelete$(item.id).subscribe(() => {
            this.toastrService.success('Delete success.');
            this.page.page = 1;
            this.getData();
            this.spinner.hide('global');
          });
        }
      });
  }






}
