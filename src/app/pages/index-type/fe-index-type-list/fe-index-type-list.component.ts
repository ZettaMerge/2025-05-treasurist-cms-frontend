import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CheckPermissionService, FundIndexService } from '@api';
import { CalculateIndexTransactionDTO, FundIndexTypeDTO, IndexTypeDTO } from '@model';
import { BaseFeatureGridComponent, BaseFeatureTabComponent, GridTableColumn, ModalComponent, PnStorageService, PopupService } from '@postnerd-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { PermissionEnum } from '@app/core/variables/permission.enum';
import { LastSyncEnum } from 'src/app/api/constant';

interface FilterType {
  indexType: any;
  status: any;
}

interface PropType extends FundIndexTypeDTO {
  'indexType.name'?: string;
}



@Component({
  selector: 'fe-index-type-list',
  templateUrl: './fe-index-type-list.component.html',
  styleUrls: ['./fe-index-type-list.component.scss']
})
export class FeIndexTypeListComponent extends BaseFeatureGridComponent<IndexTypeDTO, any> implements OnInit {

  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;
  @ViewChild('recalModal') recalModal: ModalComponent;

  filter: FilterType = { status: undefined } as FilterType;

  lastSyncData: CalculateIndexTransactionDTO = {} as CalculateIndexTransactionDTO;

  dataSub: Subscription;
  lastSyncSub: Subscription;
  dropdownSub: Subscription;

  sortData = 'name';
  direction = 'asc';

  canCreate: boolean;
  isDisable: boolean = false;

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
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.IndexType).then(result => {
      if (result) {
        this.canCreate = result.canCreate;
        this.setColumns();
      }
      console.log('this.canCreate', this.canCreate);
    });
    super.ngOnInit();
    this.getData();
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

  clearFilter() {
    this.filter = {
      indexType: undefined,
      status: undefined,

    } as FilterType

    this.getData();
  }



  protected setColumns() {
    const temp = [
      {
        name: 'Index Type',
        prop: 'name',
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'สถานะ',
        prop: 'isActive',
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.statusTpl
      },
    ] as GridTableColumn<IndexTypeDTO>[];

    if (this.canCreate) {
      temp.push(
        {
          name: '',
          prop: '_action',
          cellTemplate: this.grid.actionTpl,
          minWidth: 120, width: 120,
          sortable: false,
          canAutoResize: false,
          headerClass: 'justify-content-center',
          cellClass: 'justify-content-center'
        });
    }

    this.columns = temp;
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.fundIndexService.fundIndexIndexTypeListGet$(
      this.sortData, // column
      this.direction, // direction
      this.filter.status, // isActive
      this.page.perPage, // limit
      this.filter.indexType || undefined, // name
      this.page.page,

    ).subscribe(data => {
      this.rows = data.indexTypes;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
      console.log('data', data);
    });
  }



  save() {

    this.modal.close();
    this.getData();
    this.page.page = 1;
  }

  onDelete(item) {
    console.log('item', item);
    this.popupService.confirmDelete(`${item?.name}`)
      .subscribe((res) => {
        if (res) {
          this.spinner.show('global');
          this.fundIndexService.fundIndexIndexTypeDelete$(item.id).subscribe(() => {
            this.toastrService.success('Delete success.');
            this.page.page = 1;
            this.getData();
            this.spinner.hide('global');
          });
        }
      });
  }

  // goEdit(item) {
  //   // const url = `news/edit/${item.id}`;
  //   // window.open(url, '_blank');
  // }



}
