import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {BaseFeatureGridComponent, GridTableColumn, PnStorageService, PopupService} from '@postnerd-core';
import { NewsDTO } from '@model';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import {CheckPermissionService, NewsService} from '@api';
import * as moment from 'moment';
import { debounce } from 'lodash';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {PermissionEnum} from "@app/core/variables/permission.enum";

interface FilterType {
  title?: string;
  status?: string;
  feature?: any;
  pinned?: any;
}


@Component({
  selector: 'news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent extends BaseFeatureGridComponent<NewsDTO, any>  implements OnInit {

  @ViewChild('titleTpl', { static: true }) titleTpl: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;

  dataSub: Subscription;

  canCreate: boolean;
  canView: boolean;

  sortData = 'updatedDate';
  direction = 'desc';

  filter: FilterType = {} as FilterType;

  statuses = [
    {value: undefined, label: 'All'},
    {value: 'Publish', label: 'Publish'},
    {value: 'Close', label: 'Close'}
  ];

  featureList = [
    {value: undefined, label: 'All'},
    {value: true, label: 'YES'},
    {value: false, label: 'NO'}
  ];

  pinList = [
    {value: undefined, label: 'All'},
    {value: true, label: 'YES'},
    {value: false, label: 'NO'}
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private newsService: NewsService,
    private router: Router,
    private toastrService: ToastrService,
    private popupService: PopupService,
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
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.News).then(result => {
      if (result) {
        this.canCreate = result.canCreate;
        this.canView = result.canView;
        this.setColumns();
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

  onDelete(item) {
    console.log('item', item);
    this.popupService.confirmDelete(`${item?.title}`)
      .subscribe((res) => {
        if (res) {
          this.spinner.show('global');
          this.newsService.newsDelete$(item.id).subscribe(() => {
            this.toastrService.success('Delete success.');
            this.page.page = 1;
            this.getData();
            this.spinner.hide('global');
          });
        }
      });
  }

  protected setColumns() {
    const temp = [
      {
        name: 'หัวข้อ',
        prop: 'title',
        width: 350,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.titleTpl,
      },
      {
        name: 'สถานะ',
        prop: 'status',
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.statusTpl
      },
      {
        name: 'วันที่แก้ไขล่าสุด',
        prop: 'updatedDate',
        sortable: true,
        width: 150,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTimeTpl,
      },
    ] as GridTableColumn<NewsDTO>[];

    if (this.canView && !this.canCreate) {
      temp.push(
        {
          name: '', prop: '_action',
          cellTemplate: this.grid.detailTpl,
          minWidth: 80, width: 130,
          sortable: false,
          canAutoResize: false,
          cellClass: 'justify-content-center',
          headerClass: 'justify-content-center',
        });
    } else if (this.canCreate && this.canView || this.canCreate && !this.canView) {
      temp.push({
        name: '', prop: '_action',
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

    console.log('this.filter.pinned', this.filter.pinned);
    console.log('this.filter.pinned', this.filter.pinned && this.filter.pinned === true);
    console.log('this.filter.pinned', this.filter.pinned === false);

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.newsService.newsListGet$(
      this.sortData,
      this.direction,
      this.page.perPage,
      this.page.page,
      this.filter.title || undefined,
      this.filter.status || undefined,
      this.filter.feature && this.filter.feature === true ? this.filter.feature : this.filter.feature === false ? false : undefined,
      this.filter.pinned && this.filter.pinned === true ? this.filter.pinned : this.filter.pinned === false ? false : undefined,
    ).subscribe(data => {
      this.rows = data.news;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
      console.log('data', data);
    });
  }

  clearFilter() {
    this.filter = {
      title: undefined,
      status: undefined,
    } as FilterType;
    this.page.page = 1;
    this.getData();
  }

  goBack() {
    this.router.navigate([`./news`]);
  }

  goToCreate() {
    const url = `news/new`;
    window.open(url, '_blank');
  }

  goEdit(item) {
    const url = `news/edit/${item.id}`;
    window.open(url, '_blank');
  }

  detail(item) {
    const url = `news/edit/${item.id}`;
    window.open(url, '_blank');
  }
}
