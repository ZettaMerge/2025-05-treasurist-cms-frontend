import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseFeatureGridComponent, PnStorageService} from '@postnerd-core';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {CheckPermissionService, CustomNotificationsService} from '@api';
import {CustomNotificationsDTO} from '@model';
import * as _ from 'lodash';
import {debounce} from 'lodash';
import * as moment from 'moment';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {PermissionEnum} from "@app/core/variables/permission.enum";


interface FilterType {
  title: string;
  type: any;
  dateRange?: Date[];
}

@Component({
  selector: 'custom-notification-list',
  templateUrl: './custom-notification-list.component.html',
  styleUrls: ['./custom-notification-list.component.scss']
})
export class CustomNotificationListComponent extends BaseFeatureGridComponent<CustomNotificationsDTO, any> implements OnInit, OnDestroy {

  @ViewChild('titleTpl', {static: true}) titleTpl: TemplateRef<any>;
  @ViewChild('typeTpl', {static: true}) typeTpl: TemplateRef<any>;
  @ViewChild('statusTpl', {static: true}) statusTpl: TemplateRef<any>;

  canCreate: boolean;
  canView: boolean;

  sortData = 'publishedDate';
  direction = 'desc';
  typeList = [
    {id: 1, name: 'ประกาศจาก เทรเชอริสต์', value: 'TSR'},
    {id: 2, name: 'ประกาศจาก ก.ล.ต.', value: 'SEC'},
    {id: 3, name: 'ประกาศจาก บลจ.', value: 'AMC'},
  ];
  dataSub: Subscription;

  filter: FilterType = {
    title: undefined,
    type: undefined,
    dateRange: undefined,
  } as FilterType;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private customNotificationsService: CustomNotificationsService,
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
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.CustomNotification).then(result => {
      if (result) {
        this.canCreate = result.canCreate;
        this.canView = result.canView;
      }

      console.log('result', result);
    });

    super.ngOnInit();
    this.getData();
  }

  searchTextChange(event: string) {
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


  add() {
    const url = `custom-notification/new`;
    window.open(url, '_blank');
  }


  protected setColumns() {
    this.columns = [
      {
        name: 'หัวข้อ',
        prop: 'title',
        width: 200,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.titleTpl
      },
      {
        name: 'ประเภท',
        prop: 'type',
        sortable: false,
        width: 100,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.typeTpl,
      },
      {
        name: 'วันที่อัปเดต',
        prop: 'publishedDate',
        sortable: true,
        width: 80,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTimeTpl
      },
      {
        name: 'อัปเดตโดย',
        prop: 'publishedBy',
        sortable: false,
        width: 80,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'สถานะ',
        prop: 'status',
        sortable: false,
        width: 100,
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

    this.dataSub = this.customNotificationsService.customNotificationListGet$(
      this.sortData,
      this.direction,
      this.filter.dateRange ? this.filter.dateRange[1].toISOString() : undefined,
      this.page.perPage,
      this.page.page,
      this.filter.dateRange ? this.filter.dateRange[0].toISOString() : undefined,
      this.filter.title,
      this.filter?.type?.value || undefined,
    ).subscribe(data => {
      this.rows = data.customNotifications;
      this.page.totalCount = data.pagination.allRecord;
      console.log('data', data);
      this.spinner.hide('global');
    });
  }

  detailInfo(item) {
    if (item && item.status === 'Draft') {
      // NOTE Edit
      const url = `custom-notification/${item.id}`;
      window.open(url, '_blank');
    } else {
      // NOTE Detail
      const url = `custom-notification/detail/${item.id}`;
      window.open(url, '_blank');
    }

  }

  clearFilter() {
    this.filter = {
      title: undefined,
      type: undefined,
      dateRange: undefined,
    } as FilterType;

    this.page.page = 1;
    this.getData();
  }

}
