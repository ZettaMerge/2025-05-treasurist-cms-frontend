import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {CheckPermissionService, DocumentFileService} from '@api';
import {BaseFeatureGridComponent, PnStorageService, PopupService} from '@postnerd-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {PermissionEnum} from "@app/core/variables/permission.enum";

@Component({
  selector: 'fe-general-file-list',
  templateUrl: './fe-general-file-list.component.html',
  styleUrls: ['./fe-general-file-list.component.scss']
})
export class FeGeneralFileListComponent extends BaseFeatureGridComponent<any> implements OnInit {
  @ViewChild('actionEditTpl', { static: true }) actionEditTpl: TemplateRef<any>;
  dataSub: Subscription;

  canCreate: boolean;
  canView: boolean;

  constructor(
    private router: Router,
    private popupService: PopupService,
    private spinner: NgxSpinnerService,
    private documentFileService: DocumentFileService,
    private toastrService: ToastrService,
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

  goBack() {
    this.router.navigate([`./content-management`]);
  }

  delete(item) {
    console.log('Delete', item);
    this.popupService.confirm(`ลบไฟล์`, `คุณต้องการลบ ไฟล์ "${item.name}" หรือไม่ ?`, `danger`)
      .subscribe((data) => {
        if (data) {
          this.spinner.show('global');
          this.documentFileService.documentFilesDelete$(item.id).subscribe(data => {
            console.log('delete: ', data);
            this.toastrService.success('Delete successful.');
            this.getData();
          });
        }
      });

  }

  copyLink(item: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = item;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  save() {
    this.modal.close();
    this.page.page = 1;
    this.getData();
  }

  protected setColumns() {
    this.columns = [
      {
        name: 'หมวดหมู่เอกสาร',
        prop: 'docFileCategory',
        width: 120,
        sortable: false,
      },
      {
        name: 'ประเภทเอกสาร',
        prop: 'docFileType',
        width: 150,
        sortable: false,
        cellClass: 'text-wrap',
      },
      {
        name: 'ชื่อไฟล์',
        prop: 'name',
        width: 200,
        sortable: false,
        cellClass: 'text-wrap',
      },
      {
        name: 'วันที่อัปเดต',
        prop: 'updatedDate',
        width: 100,
        sortable: false,
        cellTemplate: this.grid.dateTpl,
      },
      {
        name: 'หมายเหตุ',
        prop: 'remark',
        sortable: false,
        cellClass: 'text-wrap',
        width: 100,
      },
      {
        name: '', prop: '_action',
        cellTemplate: this.actionEditTpl,
        minWidth: 200, width: 200,
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

    this.dataSub = this.documentFileService.documentFilesListGet$(
      this.page.perPage,
      this.page.page,
    ).subscribe(data => {
      this.rows = data.documentFiles;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
      console.log('documentFilesListGet', this.rows);
    });
  }
}
