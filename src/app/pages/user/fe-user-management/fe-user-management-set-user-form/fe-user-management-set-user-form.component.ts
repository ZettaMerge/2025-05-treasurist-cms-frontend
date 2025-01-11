import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {BaseFeatureGridComponent, GridTableColumn, ModalComponent, PopupService} from '@postnerd-core';
import {UserCheckListsDTO} from '@model';
import {Subscription} from 'rxjs';
import {debounce} from 'lodash';
import * as _ from 'lodash';
import {NgxSpinnerService} from 'ngx-spinner';
import {RoleService} from '@api';
import {UserService} from 'src/app/api/service/user.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'fe-user-management-set-user-form',
  templateUrl: './fe-user-management-set-user-form.component.html',
  styleUrls: ['./fe-user-management-set-user-form.component.scss']
})
export class FeUserManagementSetUserFormComponent extends BaseFeatureGridComponent<any> implements OnInit {
  @ViewChild('nameTpl', {static: true}) nameTpl: TemplateRef<any>;
  @ViewChild('modal') modal: ModalComponent;
  @Input() roleId;
  @Input() canView;
  @Input() canCreate;
  @Output() clearFilter = new EventEmitter<any>();

  filterName: string;

  searchDebounce = _.debounce(
    () => {
      this.page.page = 1;
      this.getData();
    },
    1000,
    {leading: false, trailing: true}
  );

  dataSub: Subscription;

  constructor(
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private toastrService: ToastrService,
    private popupService: PopupService,) {
    super();

  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getData();
  }

  protected setColumns() {
    const temp = [
      {
        name: 'ชื่อ-นามสกุล',
        prop: 'name',
        width: 150,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.nameTpl,
      },
      {
        name: 'อีเมล',
        prop: 'email',
        sortable: false,
        width: 80,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'เบอร์โทรศัพท์',
        prop: 'phoneNumber',
        sortable: false,
        width: 100,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
      },
      {
        name: 'วันที่ทำรายการ',
        prop: 'updatedDate',
        sortable: false,
        width: 80,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTpl,
      }
    ] as GridTableColumn<any>[];

    if (this.canCreate && !this.canView || this.canCreate && this.canView) {
      temp.push({
        name: '', prop: '_action',
        cellTemplate: this.grid.actionTpl,
        minWidth: 80, width: 100,
        sortable: false,
        canAutoResize: false,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
      });
    }
    this.columns = temp;
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.spinner.hide('global');
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.userService.userRoleListGet$(
      this.page.page,
      this.roleId || undefined,
      this.filterName || undefined,
      this.page.perPage,
    ).subscribe(data => {
      this.rows = data.users;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
      console.log('getData', this.rows);
    });
  }

  delete(item) {
    this.popupService.confirm(`ยืนยันการลบผู้ใช้งาน`, ` ท่านต้องการที่จะลบ "${item?.firstName}  ${item?.lastName}" หรือไม่?`, `danger`)
      .subscribe((res) => {
        if (res) {
          this.spinner.show('global');
          this.userService.userRoleDelete$(item.id).subscribe(() => {
            this.toastrService.success('ลบผู้ใช้งานสำเร็จ.');
            this.page.page = 1;
            this.getData();
            this.spinner.hide('global');
          });
        }
      });
  }


  save() {
    this.modal.close();
    this.page.page = 1;
    this.getData();
  }

  onClearFilter() {
    this.filterName = undefined;
    this.page.page = 1;
    this.getData();
  }

  goBack() {
  }

}
