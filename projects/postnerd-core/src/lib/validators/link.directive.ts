import { NG_VALIDATORS, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Directive, forwardRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[vLink][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => LinkDirective), multi: true }],
})
export class LinkDirective implements Validators {

  // private regex = /(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?/;
  private regex = /^(?:http(s)?:\/\/)+[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  validate(control: AbstractControl): ValidationErrors | null {
    // valid for empty value
    if (control.value === undefined || control.value === null || control.value === '') {
      return null;
    }

    if (this.regex.test(control.value)) {
      return null;
    }

    return { vLink: true };
  }
}
