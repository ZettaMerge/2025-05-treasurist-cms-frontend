import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseFeatureGridComponent, GridTableColumn, PnStorageService, PopupService} from '@postnerd-core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {CheckPermissionService, MeService, RoleService} from '@api';
import _ from 'lodash';
import {ToastrService} from 'ngx-toastr';
import {PermissionEnum} from '@app/core/variables/permission.enum';

@Component({
  selector: 'fe-user-management',
  templateUrl: './fe-user-management.component.html',
  styleUrls: ['./fe-user-management.component.scss']
})
export class FeUserManagementComponent extends BaseFeatureGridComponent<any> implements OnInit, OnDestroy {

  canView: boolean;
  canCreate: boolean;
  filterRole: string;

  roleList;

  searchDebounce = _.debounce(
    () => {
      this.page.page = 1;
      this.getData();
    },
    1000,
    {leading: false, trailing: true}
  );
  dataSub: Subscription;
  dataListSub: Subscription;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private roleService: RoleService,
    private popupService: PopupService,
    private toastrService: ToastrService,
    private meService: MeService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getData();
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.UseRoleManagement).then(result => {
      if (result) {
        this.canView = result.canView;
        this.canCreate = result.canCreate;
        this.setColumns();
      }
    });
  }

  protected setColumns() {
    const temp = [
      {
        name: 'Role',
        prop: 'name',
        width: 150,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'จำนวนสมาชิก',
        prop: 'userCount',
        sortable: false,
        width: 80,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
    ] as GridTableColumn<any>[];
    if (this.canView && !this.canCreate) {
      temp.push(
        {
          name: '', prop: '_action',
          cellTemplate: this.grid.detailTpl,
          minWidth: 80, width: 120,
          sortable: false,
          canAutoResize: false,
          headerClass: 'justify-content-center',
          cellClass: 'justify-content-center'
        });
    } else if (this.canCreate && this.canView || this.canCreate && !this.canView) {
      temp.push({
        name: '', prop: '_action',
        cellTemplate: this.grid.actionEditTpl,
        minWidth: 80, width: 100,
        sortable: false,
        canAutoResize: false,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center'
      });
    }
    this.columns = temp;
  }

  protected getData() {


    this.spinner.show('global');

    if (this.dataSub) {
      // this.spinner.hide('global');
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.roleService.roleListGet$(
      this.filterRole || undefined,
      this.page.page,
      this.page.perPage,
    ).subscribe(data => {
      this.rows = data.roles;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
    });

  }

  // getDropdownRoleList() {

  //   if (this.dataListSub) {
  //     this.dataListSub.unsubscribe();
  //   }

  //   this.dataListSub = this.roleService.roleListGet$(
  //     undefined,
  //     1,
  //     9999,
  //   ).subscribe(data => {
  //     const roles = data.roles;
  //     this.roleList = [];
  //     roles.forEach(role => {
  //       this.roleList.push({ id: role.id, name: role.name });
  //     });
  //     console.log('roleList', this.roleList);

  //   });

  // }


  add() {
    this.router.navigate([`./user/new`]);
  }

  edit(item) {
    console.log('id', item);
    this.router.navigate([`./user/edit/${item.id}`]);
  }

  goTodetail(item) {
    console.log('id', item);
    this.router.navigate([`./user/view/${item.id}`]);
  }

  clearFilter() {
    this.filterRole = undefined;
    this.page.page = 1;
    this.getData();
  }

}
