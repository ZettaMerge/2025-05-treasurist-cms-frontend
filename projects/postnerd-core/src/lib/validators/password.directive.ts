import { NG_VALIDATORS, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Directive, forwardRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[vPassword][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => PassWordValidatorDirective), multi: true }],
})
export class PassWordValidatorDirective implements Validators {

  private regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z#.$@!%&*?]{8,32}$/;

  validate(control: AbstractControl): ValidationErrors | null {
    // valid for empty value
    if (control.value === undefined || control.value === null || control.value === '') {
      return null;
    }

    if (this.regex.test(control.value)) {
      return null;
    }

    return { vPassword: true };
  }
}
