import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {RoleService} from '@api';
import {PermissionDTO, RoleDTO, RolePermissionsDTO} from '@model';
import * as _ from 'lodash';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';

@Component({
  selector: 'fe-user-management-set-permission-form',
  templateUrl: './fe-user-management-set-permission-form.component.html',
  styleUrls: ['./fe-user-management-set-permission-form.component.scss']
})
export class FeUserManagementSetPermissionFormComponent implements OnInit, OnChanges {
  @Input() permissionDetail: RolePermissionsDTO[];
  @Input() roleId;
  @Input() canView;
  @Input() canCreate;
  @Output() changePermission = new EventEmitter<any>();
  permissionList: RolePermissionsDTO[] = [];
  permissionData: RolePermissionsDTO[] = [];

  // OnChanges

  checkAll = false;

  dataSub: Subscription;
  saveSub: Subscription;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.spinner.show('global');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getPermissions();
  }


  onCheckAll(event) {
    console.log('check', event);
    if (event === true) {

      if (!_.isEmpty(this.permissionDetail)) {

        console.log('have permissionDetail');
        this.permissionList = _.map(this.permissionDetail, (item) => ({
          id: item.id,
          createdBy: item.createdBy,
          createdDate: item.createdDate,
          updatedBy: item.updatedBy,
          updatedDate: item.updatedDate,
          deletedBy: item.deletedBy,
          deletedDate: item.deletedDate,
          canApprove: item.permission?.name === 'User Management' || item.permission?.name === 'Agent Management' || item.permission?.name === 'Fund Data' || item.permission?.name === 'AMCs Management' || item.permission?.name === 'Customer Notification' || item.permission?.name === 'Content Management' ? false : true,
          canCreate: item.permission?.name === 'Customer - Customer List' ||
          item.permission?.name === 'Agent - Customer Service' ||
          item.permission?.name === 'Commission - Agent Fee Report' ||
          item.permission?.name === 'Commission - TSR Incentive Rate' ||
          item.permission?.name === 'Order - Transaction' ||
          item.permission?.name === 'Order - Vulnerable Transaction' ||
          item.permission?.name === 'Audit Risk' ? false : true,
          canDelete: item.permission?.name === 'Order Management' || item.permission?.name === 'Fund Data' ? false : true,
          canExport: item.permission?.name === 'Audit Risk' ||
          item.permission?.name === 'Commission - TSR Incentive Rate' ||
          item.permission?.name === 'Commission - Payment' ||
          item.permission?.name === 'Order - Vulnerable Transaction' ||
          item.permission?.name === 'Order - Order Placement' ||
          item.permission?.name === 'Fund Data' ||
          item.permission?.name === 'Order - Transaction' ? true : false,
          canUpdate: true,
          canView: true,
          permission: item.permission,
        }));
      } else {

        console.log('no permissionDetail');
        this.permissionList = _.map(this.permissionList, (item) => ({
          canApprove: item.permission?.name === 'User Management' || item.permission?.name === 'Agent Management' || item.permission?.name === 'Fund Data' || item.permission?.name === 'AMCs Management' || item.permission?.name === 'Customer Notification' || item.permission?.name === 'Content Management' ? false : true,
          canCreate: item.permission?.name === 'Customer - Customer List' ||
          item.permission?.name === 'Agent - Customer Service' ||
          item.permission?.name === 'Commission - Agent Fee Report' ||
          item.permission?.name === 'Commission - TSR Incentive Rate' ||
          item.permission?.name === 'Order - Transaction' ||
          item.permission?.name === 'Order - Vulnerable Transaction' ||
          item.permission?.name === 'Audit Risk' ? false : true,
          canDelete: item.permission?.name === 'Order Management' || item.permission?.name === 'Fund Data' ? false : true,
          canExport: item.permission?.name === 'Audit Risk' ||
          item.permission?.name === 'Commission - TSR Incentive Rate' ||
          item.permission?.name === 'Commission - Payment' ||
          item.permission?.name === 'Order - Vulnerable Transaction' ||
          item.permission?.name === 'Order - Order Placement' ||
          item.permission?.name === 'Fund Data' ||
          item.permission?.name === 'Order - Transaction' ? true : false,
          canUpdate: true,
          canView: true,
          permission: item.permission,
        }));
      }

      console.log('this.permissionList check all', this.permissionList);
    } else {
      console.log('false');
      if (!_.isEmpty(this.permissionDetail)) {
        console.log('false permissionDetail');
        this.permissionList = _.map(this.permissionDetail, (item) => ({
          id: item.id,
          canApprove: false,
          canCreate: false,
          canDelete: false,
          canExport: false,
          canUpdate: false,
          canView: false,
          permission: item.permission,
          createdBy: item.createdBy,
          createdDate: item.createdDate,
          updatedBy: item.updatedBy,
          updatedDate: item.updatedDate,
          deletedBy: item.deletedBy,
          deletedDate: item.deletedDate,
        }));
      } else {
        console.log('false no permissionDetail');
        this.permissionList = _.map(this.permissionList, (item) => ({
          canApprove: false,
          canCreate: false,
          canDelete: false,
          canExport: false,
          canUpdate: false,
          canView: false,
          permission: item.permission,
        }));
      }
      console.log('this.permissionList false', this.permissionList);
    }
    console.log('this.permissionList dattt', this.permissionList);
    this.changePermission.emit(this.permissionList);

  }

  onChangePermission(event, index, permission: RolePermissionsDTO) {
    console.log('permission', permission);
    const findIndex = _.findIndex(this.permissionList, (p) => p.permission.id === permission.permission.id);
    console.log('findIndex', findIndex);
    this.permissionList[findIndex].canApprove = permission.canApprove;
    this.permissionList[findIndex].canCreate = permission.canCreate;
    this.permissionList[findIndex].canDelete = permission.canDelete;
    this.permissionList[findIndex].canExport = permission.canExport;
    this.permissionList[findIndex].canUpdate = permission.canUpdate;
    this.permissionList[findIndex].canView = permission.canView;
    // console.log('permissionData', this.permissionList);
    this.changePermission.emit(this.permissionList);
  }

  getPermissions() {
    this.dataSub = this.roleService.permissionListGet$()
      .subscribe(data => {
        // console.log('getPermissions1', data);
        console.log('permissionDetail', this.permissionDetail);

        this.permissionList = _.map(data, (item) => ({
          canApprove: false,
          canCreate: false,
          canDelete: false,
          canExport: false,
          canUpdate: false,
          canView: false,
          permission: item,
        }));

        if (this.roleId) {
          const filterPermissions = this.permissionList.map(pl => _.find(this.permissionDetail, ['permission.id', pl.permission.id]) ? _.find(this.permissionDetail, ['permission.id', pl.permission.id]) : pl);
          this.permissionList = filterPermissions;
          console.log('permissionList', this.permissionList);
        } else {
          this.changePermission.emit(this.permissionList);
        }
        console.log('getPermissions', this.permissionList);
        // console.log('filterPermissions', filterPermissions);
        this.spinner.hide('global');
      });

  }
}
