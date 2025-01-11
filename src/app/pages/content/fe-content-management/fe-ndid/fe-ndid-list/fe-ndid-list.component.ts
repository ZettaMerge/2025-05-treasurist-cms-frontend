import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {CheckPermissionService, ContentService} from '@api';
import { ContentDTO } from '@model';
import {BaseFeatureGridComponent, PnStorageService} from '@postnerd-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {PermissionEnum} from "@app/core/variables/permission.enum";
@Component({
  selector: 'fe-ndid-list',
  templateUrl: './fe-ndid-list.component.html',
  styleUrls: ['./fe-ndid-list.component.scss']
})
export class FeNdidListComponent extends BaseFeatureGridComponent<any> implements OnInit {
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;
  @ViewChild('versionTpl', { static: true }) versionTpl: TemplateRef<any>;
  @ViewChild('actionEditTpl', { static: true }) actionEditTpl: TemplateRef<any>;
  ndid: ContentDTO = {} as ContentDTO;
  dataSub: Subscription;

  canCreate: boolean;
  canView: boolean;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private ndidService: ContentService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
    ) {
    super();
  }

  ngOnInit(): void {
    // CHECK PERMISSION
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.Content).then(result => {
      if (result) {
        this.canCreate = result.canCreate;
        this.canView = result.canView;
      }

      console.log('result', result);
    });
    super.ngOnInit();
    this.getData();
  }

  add() {
    this.router.navigate([`./content-management/ndid/new`]);
  }

  edit(item) {
    console.log('item', item);
    this.router.navigate([`./content-management/ndid/${item.id}`]);
  }

  protected setColumns() {
    this.columns = [
      {
        name: 'หัวข้อ',
        prop: 'title',
        width: 150,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'transactionId'
      },
      {
        name: 'วันที่อัปเดท',
        prop: 'updatedDate',
        sortable: false,
        width: 100,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTpl,
      },
      {
        name: 'อัปเดตโดย',
        prop: 'updatedBy',
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        width: 130,
      },
      {
        name: 'เวอร์ชัน',
        prop: 'version',
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        width: 120,
        cellTemplate: this.versionTpl,
      },
      {
        name: 'สถานะ',
        prop: 'isActive',
        sortable: false,
        width: 120,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.statusTpl,
      },
      {
        name: '', prop: 'isEditable',
        cellTemplate: this.actionEditTpl,
        minWidth: 80, width: 100,
        sortable: false,
        canAutoResize: false,
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

    this.dataSub = this.ndidService.contentGetList$(
      'id',
      'asc',
      undefined,
      this.page.perPage,
      this.page.page,
      'TERM_NDID',
      undefined,
    ).subscribe(data => {
      this.rows = data.contents;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
      console.log('data.totalContent', this.rows);
    });
  }
}
