import { NG_VALIDATORS, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Directive, forwardRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[vEmail][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidatorDirective), multi: true }],
})
export class EmailValidatorDirective implements Validators {

  private regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  validate(control: AbstractControl): ValidationErrors | null {
    // valid for empty value
    if (control.value === undefined || control.value === null || control.value === '') {
      return null;
    }

    if (this.regex.test(control.value)) {
      return null;
    }

    return { vEmail: true };
  }
}
