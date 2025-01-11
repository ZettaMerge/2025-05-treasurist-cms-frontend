import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { UserDTO } from '@model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/api/service/user.service';
import * as _ from 'lodash';
import { PopupService } from '@postnerd-core';
@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Input() userData: UserDTO = {} as UserDTO;
  @Input() isNew;
  @Input() roleId;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() delete = new EventEmitter();
  isError: boolean;

  saveSub: Subscription;
  constructor(
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private toastrService: ToastrService,
    private popupService: PopupService,) {
  }

  ngOnInit(): void {
    console.log('isNew', this.isNew);
    console.log('this.userData', this.userData);

  }

  onSave(form) {
    this.isError = false;
    this.spinner.show('global');
    if (form.invalid) {
      this.spinner.hide('global');
      return;
    }

    console.log('this.userData', this.userData);

    if (this.userData.id) {
      this.userData.updatedDate = undefined;
      this.saveSub = this.userService.userRoleUpdate$(this.userData, this.userData.id).subscribe((data) => {
        console.log('save role', data);
        this.spinner.hide('global');
        this.toastrService.success('แก้ไขข้อมูลเรียบร้อย.');
        this.save.emit();
      });
    } else {
      this.saveSub = this.userService.userRolePost$({
        roleId: _.toNumber(this.roleId),
        user: this.userData
      }).subscribe((data) => {
        console.log('save role', data);
        this.spinner.hide('global');
        this.toastrService.success('บันทึกข้อมูลเรียบร้อย.');
        this.save.emit();
      }, (error) => {
        console.log('error save', error);
        this.spinner.hide('global');
        if (error && error.error) {
          const errors = JSON.parse(error.error);
          if (errors.errorCode === 'DT4002') {
            this.isError = true;
          } else if (errors.errorCode !== 'DT4002') {
            this.isError = false;
            this.toastrService.error(`${errors.errorMessage}`);
          }
        }
      });

    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onEmailChange() {
    this.isError = false;
  }

  onDelete(item) {
    this.popupService.confirm(`ยืนยันการลบผู้ใช้งาน`, ` ท่านต้องการที่จะลบ "${item?.firstName}  ${item?.lastName}" หรือไม่?`, `danger`)
      .subscribe((res) => {
        if (res) {
          this.spinner.show('global');
          this.userService.userRoleDelete$(item.id).subscribe(() => {
            this.toastrService.success('ลบผู้ใช้งานสำเร็จ.');
            this.save.emit();
            this.spinner.hide('global');
          });
        }
      });
  }


}
