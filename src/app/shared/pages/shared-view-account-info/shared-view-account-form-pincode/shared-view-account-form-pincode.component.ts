import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'shared-view-account-form-pincode',
  templateUrl: './shared-view-account-form-pincode.component.html',
  styleUrls: ['./shared-view-account-form-pincode.component.scss']
})
export class SharedViewAccountFormPincodeComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  @ViewChildren('formRow') rows: any;
  @Input() isNew: boolean;
  pinCodeForm: FormGroup;
  formInput = ['pincode1', 'pincode2', 'pincode3', 'pincode4', 'pincode5', 'pincode6'];
  confirmNewPassword: string;
  passWordNew: string;
  constructor() {
    this.pinCodeForm = this.toFormGroup(this.formInput);
  }

  ngOnInit(): void {
    this.pinCodeForm = this.toFormGroup(this.formInput);
  }

  toFormGroup(elements) {
    const group: any = {};

    elements.forEach(key => {
      group[key] = new FormControl('', [Validators.required, Validators.pattern('^[0-9]')]);
    });
    return new FormGroup(group);
  }

  keyUpEvent(event, index) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < this.formInput.length) {
      this.rows._results[pos].nativeElement.focus();
    }

  }
  onSubmit() {

    let pincodeKey = '';
    this.formInput.forEach(key => {
      pincodeKey += this.pinCodeForm.get(key).value;
    });
    console.log('pincodeKey', pincodeKey);    // this.save.emit(otpKey)
    this.pinCodeForm.reset();
  }

  onCancel() {
    this.cancel.emit();
  }

  validateOtpInput() {
    let result = false;
    this.formInput.forEach(key => {
      const otpRef = this.pinCodeForm.get(key);
      result = result || (otpRef?.invalid && otpRef.errors.pattern);
    });
    return result;
  }

}
