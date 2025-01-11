import { NG_VALIDATORS, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Directive, forwardRef, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[vEqualTo][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualToValidatorDirective), multi: true }],
})
export class EqualToValidatorDirective implements Validators {

  @Input() vEqualTo;
  @Input() targetName;

  validate(control: AbstractControl): ValidationErrors | null {
    // valid for empty value
    if (control.value === undefined || control.value === null || control.value === '') {
      return null;
    }

    if (this.vEqualTo === control.value) {
      return null;
    }

    return {
      vEqualTo: {
        targetValue: this.vEqualTo,
        targetName: this.targetName,
      },
    };
  }
}
