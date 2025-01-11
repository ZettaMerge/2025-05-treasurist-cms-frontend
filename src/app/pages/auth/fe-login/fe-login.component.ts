import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '@app/core/auth/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {createTrue} from 'typescript';
import {MeService} from "@api";
import {PnStorageService} from "@postnerd-core";
import {PermissionEnum} from "@app/core/variables/permission.enum";
import * as _ from 'lodash';

@Component({
  selector: 'fe-login',
  templateUrl: './fe-login.component.html',
  styleUrls: ['./fe-login.component.scss']
})
export class FeLoginComponent implements OnInit {

  // data: Partial<{ username: string; password: string }> = {
  //   username: 'superadmin@email.com',
  //   password: 'super_admin'
  // };
  data: Partial<{ username: string; password: string }> = {};
  isFieldTextType: boolean;
  isError: boolean;
  isErrorPermission: boolean;
  textError: string;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private meService: MeService,
    protected pnStorageService: PnStorageService,
  ) {
  }

  ngOnInit(): void {
  }


  onSubmit(form) {
    this.isError = false;
    this.isErrorPermission = false;
    if (form.invalid) {
      return;
    }
    this.spinner.show('global');
    this.authService.requestTokenWithPasswordFlow$(this.data.username, this.data.password)
      .subscribe(
        data => {
          this.meService.meGet$()
            .subscribe(res => {
              console.log('res permission', res);
              this.pnStorageService.setItemPersistent('userRolePermission', JSON.stringify(res.userRolePermissions));
              setTimeout(() => {
                this.setPath(res);
                this.spinner.hide('global');

              }, 1000);
            });

        },
        error => {
          this.spinner.hide('global');
          console.log('error auth', error);
          if (error.error.errorCode === 'ST4001') {
            this.isError = true;
          } else if (error.error.errorCode === 'US4000' || error.error.errorCode === 'DT4001') {
            this.isErrorPermission = true;
            // this.textError = error.error.errorMessage;
          } else {
            this.toastrService.error(`${error.error.errorMessage}`);
            // this.toastrService.error('ไม่สามารถเข้าสู่ระบบได้', 'เกิดข้อผิดพลาด');
          }
        },
      );

  }

  setPath(permission) {
    if (permission.userRolePermissions) {
      console.log('....', permission.userRolePermissions);
      permission.userRolePermissions.rolePermissions.forEach(rolePermission => {
        console.log(rolePermission);
        if (rolePermission.permission.name === PermissionEnum.CustomerList && rolePermission.canView
        || rolePermission.permission.name === PermissionEnum.CustomerList && rolePermission.canCreate) {
          this.router.navigate(['/customer/list']);
        } else if (rolePermission.permission.name === PermissionEnum.UseRoleManagement && rolePermission.canView
          || rolePermission.permission.name === PermissionEnum.UseRoleManagement && rolePermission.canCreate) {
          this.router.navigate(['/user']);
        } else if (rolePermission.permission.name === PermissionEnum.CustomerRegulatoryMonitoring && rolePermission.canView
          || rolePermission.permission.name === PermissionEnum.CustomerRegulatoryMonitoring && rolePermission.canCreate) {
          this.router.navigate(['/customer/regulatory-monitoring']);
        } else if (rolePermission.permission.name === PermissionEnum.AgentProfile && rolePermission.canView
          || rolePermission.permission.name === PermissionEnum.AgentProfile && rolePermission.canCreate) {
          this.router.navigate(['/agent/profile']);
        } else if (rolePermission.permission.name === PermissionEnum.AgentCustomerService && rolePermission.canView) {
          this.router.navigate(['/agent/customer-service']);
        } else if (rolePermission.permission.name === PermissionEnum.CommissionTSRIncentiveRate && rolePermission.canView) {
          this.router.navigate(['/commission/tsr-incentive-rate']);
        } else if (rolePermission.permission.name === PermissionEnum.CommissionPayment && rolePermission.canView
          || rolePermission.permission.name === PermissionEnum.CommissionPayment && rolePermission.canCreate
          || rolePermission.permission.name === PermissionEnum.CommissionPayment && rolePermission.canExport) {
          this.router.navigate(['/commission/payment']);
        } else if (rolePermission.permission.name === PermissionEnum.CommissionAgentFeeReport && rolePermission.canView) {
          this.router.navigate(['/commission/commission-fee']);
        } else if (rolePermission.permission.name === PermissionEnum.OrderTransaction && rolePermission.canView) {
          this.router.navigate(['/order/transaction']);
        } else if (rolePermission.permission.name === PermissionEnum.OrderVulnerableTransaction && rolePermission.canView) {
          this.router.navigate(['/order/vulnerable-transaction']);
        } else if (rolePermission.permission.name === PermissionEnum.OrderPlacement && rolePermission.canView
          || rolePermission.permission.name === PermissionEnum.OrderPlacement && rolePermission.canCreate) {
          this.router.navigate(['/order/order-placement']);
        } else if (rolePermission.permission.name === PermissionEnum.FundData && rolePermission.canView
          || rolePermission.permission.name === PermissionEnum.FundData && rolePermission.canCreate) {
          this.router.navigate(['/fund']);
        } else if (rolePermission.permission.name === PermissionEnum.CustomNotification && rolePermission.canView
          || rolePermission.permission.name === PermissionEnum.CustomNotification && rolePermission.canCreate) {
          this.router.navigate(['/custom-notification']);
        } else if (rolePermission.permission.name === PermissionEnum.Content && rolePermission.canView
          || rolePermission.permission.name === PermissionEnum.Content && rolePermission.canCreate) {
          this.router.navigate(['/content-management']);
        } else if (rolePermission.permission.name === PermissionEnum.AuditRisk && rolePermission.canView) {
          this.router.navigate(['/audit-risk']);
        } else if (rolePermission.permission.name === PermissionEnum.News && rolePermission.canView
          || rolePermission.permission.name === PermissionEnum.News && rolePermission.canCreate) {
          this.router.navigate(['/news']);
        }
      });
    }
  }

  openForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  viewPassword() {
    this.isFieldTextType = !this.isFieldTextType;
  }

  onTextChange() {
    this.isError = false;
    this.isErrorPermission = false;
  }

  private getMe() {

  }

}
