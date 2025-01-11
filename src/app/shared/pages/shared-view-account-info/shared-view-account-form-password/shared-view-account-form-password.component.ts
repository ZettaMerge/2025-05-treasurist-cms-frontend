import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-view-account-form-password',
  templateUrl: './shared-view-account-form-password.component.html',
  styleUrls: ['./shared-view-account-form-password.component.scss']
})
export class SharedViewAccountFormPasswordComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  @Input() isNew: boolean;
  confirmNewPassword: string;
  passWordNew: string;
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form) {

  }

  onCancel() {
    this.cancel.emit();
  }

}
