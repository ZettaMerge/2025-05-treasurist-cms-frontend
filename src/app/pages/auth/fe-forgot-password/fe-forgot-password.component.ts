import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@api';
import { RequestResetPasswordDTO } from '@model';
import { ModalComponent, PopupService } from '@postnerd-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fe-forgot-password',
  templateUrl: './fe-forgot-password.component.html',
  styleUrls: ['./fe-forgot-password.component.scss']
})
export class FeForgotPasswordComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  RequestResetPasswordData: RequestResetPasswordDTO = {} as RequestResetPasswordDTO;
  submitted = false;
  isError: boolean;
  textErr: string;
  saveSub: Subscription;
  constructor(
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  onSendEmail(form) {
    this.isError = false;
    this.spinner.show('global');
    if (form.invalid) {
      this.submitted = true;
      this.spinner.hide('global');
      return;
    }
    this.submitted = false;
    this.RequestResetPasswordData.subSystem = 'CMS';
    this.saveSub = this.authService.authRequestResetPasswordPost$(this.RequestResetPasswordData)
      .subscribe((data) => {
        console.log('data', data);
        this.toastrService.success('Send email success.');
        this.spinner.hide('global');
        this.RequestResetPasswordData = {} as RequestResetPasswordDTO;
      }, (error) => {
        this.spinner.hide('global');
        if (error && error.error) {
          const errors = JSON.parse(error.error);
          this.textErr = errors.errorMessage;
          if (errors.errorCode === 'DT4001') {
            this.textErr = 'ไม่พบอีเมล ' + this.RequestResetPasswordData.email + ' ในระบบ กรุณาลองใหม่อีกครั้ง';
            console.log('textErr', this.textErr);
            this.isError = true;
          } else if (errors.errorCode !== 'DT4002') {
            this.isError = false;
            this.toastrService.error(`${errors.errorMessage}`);
          }

        }
      });
  }

  onEmailChange() {
    this.isError = false;
  }

}
