import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@api';
import { ResetPasswordDTO } from '@model';
import { ModalComponent, PopupService } from '@postnerd-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fe-reset-password',
  templateUrl: './fe-reset-password.component.html',
  styleUrls: ['./fe-reset-password.component.scss']
})
export class FeResetPasswordComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  changePassword = {
    newPassword: '',
    retypeNewPassword: '',
  };
  isShowErr = false;
  isFieldTextType: boolean;
  isFieldTextTypeNewPassword: boolean;
  hash: any;
  changePasswordSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.hash = this.route.snapshot.queryParamMap.get('hash');
    console.log('hash', this.hash);
  }

  viewPassword() {
    this.isFieldTextType = !this.isFieldTextType;
  }
  viewPasswordRetypeNewPassword() {
    this.isFieldTextTypeNewPassword = !this.isFieldTextTypeNewPassword;
  }

  onResetPassword(form) {
    this.isShowErr = false;
    this.spinner.show('global');

    if (form.invalid) {
      this.spinner.hide('global');
      return;
    }
    if (this.changePassword.retypeNewPassword !== this.changePassword.newPassword) {
      this.isShowErr = true;
      this.spinner.hide('global');
      return;
    }
    this.changePasswordSub = this.authService.authResetPasswordPost$({ newPassword: this.changePassword.newPassword, token: this.hash })
      .subscribe((data) => {
        console.log('data', data);
        this.spinner.hide('global');
        this.modal.open();
      });


  }

}
