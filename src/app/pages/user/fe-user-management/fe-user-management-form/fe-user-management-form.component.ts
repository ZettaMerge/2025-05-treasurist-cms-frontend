import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {BaseFeatureTabComponent, PnStorageService} from '@postnerd-core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleDTO, RolePermissionsDTO } from '@model';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {CheckPermissionService, RoleService} from '@api';
import * as _ from 'lodash';
import {PermissionEnum} from '@app/core/variables/permission.enum';

enum Tab {
  permissionMenu = 1,
  permissionUser = 2,
}
@Component({
  selector: 'fe-user-management-form',
  templateUrl: './fe-user-management-form.component.html',
  styleUrls: ['./fe-user-management-form.component.scss']
})
export class FeUserManagementFormComponent extends BaseFeatureTabComponent implements OnInit {

  canView: boolean;
  canCreate: boolean;

  Tab = Tab;

  tabs = [
    { name: 'กำหนดสิทธิ์ใช้งานเมนู', id: Tab.permissionMenu },
  ];

  roleData: RoleDTO = {} as RoleDTO;
  roleId: any;
  permissionList: RolePermissionsDTO[];
  permissionData: RolePermissionsDTO[];
  saveSub: Subscription;
  dataSub: Subscription;
  constructor(
    protected route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private roleService: RoleService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
    super(route);
  }

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id');
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.UseRoleManagement).then(result => {
      if (result) {
        this.canView = result.canView;
        this.canCreate = result.canCreate;
      }
    });
    if (this.roleId) {
      this.tabs.push({ name: 'กำหนดผู้ใช้งาน', id: this.Tab.permissionUser });
      this.getRoleById();
    }
  }



  goBack() {
    this.router.navigate([`./user`]);
  }

  onChangePermission(event) {
    // console.log('onSave', event);
    this.permissionData = event;
  }


  onSave(form) {

    this.spinner.show('global');
    if (form.invalid) {
      console.log('valid');
      this.spinner.hide('global');
      return;
    }

    if (this.permissionData) {
      // this.roleData.rolePermissions = this.permissionData;
      this.roleData.rolePermissions = this.permissionData;
    }
    // const findIndex = _.findIndex(this.roleData.rolePermissions, (p) => p.canApprove === true || p.canCreate === true || p.canDelete === true || p.canExport === true || p.canExport === true);
    // console.log('findIndex', findIndex);
    // if (findIndex < 0) {
    //   this.spinner.hide('global');
    //   this.toastrService.error('กรุณาเลือกสิทธิ์การใช้งานเมนู.');
    //   return;
    // }

    console.log('this.roleData.rolePermissions', this.roleData.rolePermissions);
    console.log('roleData', this.roleData);
    if (this.roleId) {
      this.saveSub = this.roleService.roleUpdate$(this.roleData, _.toNumber(this.roleId)).subscribe((data) => {
        console.log('save role', data);
        this.spinner.hide('global');
        this.toastrService.success('แก้ไขข้อมูลเรียบร้อย.');
        this.router.navigate([`./user`]);
      });

    } else {
      this.saveSub = this.roleService.rolePost$(this.roleData).subscribe((data) => {
        console.log('save role', data);
        this.spinner.hide('global');
        this.toastrService.success('บันทึกข้อมูลเรียบร้อย.');
        this.router.navigate([`./user`]);
      });
    }



  }


  getRoleById() {
    this.spinner.show('global');
    this.dataSub = this.roleService.roleIdGet$(_.toNumber(this.roleId)

    ).subscribe(data => {
      console.log('getRoleById', data);
      this.roleData = data;
      this.permissionList = this.roleData.rolePermissions;
      this.spinner.hide('global');
    });

  }
}
