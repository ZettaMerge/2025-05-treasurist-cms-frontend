import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Directive, Input, OnInit, forwardRef, OnChanges } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngModel][vEng],[ngModel][vThai],[ngModel][vDigit],[ngModel][vSpecial]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => StringValidatorDirective), multi: true }],
})
export class StringValidatorDirective implements OnChanges, Validator {

  @Input() vEng;
  @Input() vThai;
  @Input() vDigit: number | boolean;
  @Input() vSpecial: string | string[] | boolean;

  pattern: string;
  errorToken: any = {};

  ngOnChanges() {
    // validate digit only
    if (this.vDigit) {
      this.errorToken = { vDigit: this.vDigit };
      this.onChange();
      return;
    }

    // validate other
    this.pattern = '[^';

    if ((this.vEng !== undefined && this.vEng !== false) || (this.vThai !== undefined && this.vEng !== false)) {
      this.pattern += '\\s'; // whitespace
      if (this.vEng !== undefined && this.vEng !== false) {
        this.pattern += 'a-zA-Z';
        this.errorToken.vEng = true;
      }
      if (this.vThai !== undefined && this.vEng !== false) {
        this.pattern += '\\u0E00-\\u0E7F';
        this.errorToken.vThai = true;
      }
    }
    if (this.vDigit !== undefined && this.vDigit !== false) {
      this.pattern += '\\d';
      this.errorToken.vDigit = true;
    }
    if (this.vSpecial !== undefined && this.vSpecial !== false) {
      if (this.vSpecial) {
        if (Array.isArray(this.vSpecial)) {
          this.pattern += this.vSpecial.map(v => this.escapeRegex(v)).join('');
        } else {
          this.pattern += this.escapeRegex(this.vSpecial);
        }
        this.errorToken.vSpecial = this.vSpecial;
      } else {
        this.pattern += '\\[\\]\\{\\}\\/\\\\$&+,:;=?~`@#|\'"<>.^*()%!_-';
        this.errorToken.vSpecial = true;
      }
    }
    this.pattern += ']';
    this.onChange();
  }

  isValid(value) {
    // validate digit only
    if (this.vDigit) {
      return new RegExp(`^\\d{${this.vDigit}}$`).test(value);
    }

    if (this.pattern === '[^]') {
      return true;
    }

    // validate other
    return !new RegExp(this.pattern).test(value);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    // valid for empty value
    if (control.value === undefined || control.value === null || control.value === '') {
      return null;
    }

    if (this.isValid(control.value)) {
      return null;
    }
    return { vString: this.errorToken };
  }

  private escapeRegex(str) {
    if (['/', '\\', '}', '{', '[', ']'].includes(str)) {
      return `\\${str}`;
    }
    return str;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }

  private onChange = () => { };
}
