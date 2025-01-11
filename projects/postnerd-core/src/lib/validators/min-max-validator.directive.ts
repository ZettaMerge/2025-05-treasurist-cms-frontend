import { NG_VALIDATORS, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Directive, Input, forwardRef, OnChanges } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[vMin][ngModel],[vMax][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => MinMaxValidatorDirective), multi: true }],
})
export class MinMaxValidatorDirective implements OnChanges, Validators {

  @Input() vMin: number;
  @Input() vMax: number;

  ngOnChanges() {
    this.onChange();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    // valid for empty value
    if (control.value === undefined || control.value === null || control.value === '') {
      return null;
    }

    if (this.vMin == null && this.vMax == null) {
      return null;
    }

    if (this.vMin != null && this.vMax != null) {
      if (control.value >= this.vMin && control.value <= this.vMax) {
        return null;
      }
    } else if (this.vMin != null) {
      if (control.value >= this.vMin) {
        return null;
      }
    } else {
      if (control.value <= this.vMax) {
        return null;
      }
    }

    return {
      vMinMax: {
        min: this.vMin,
        max: this.vMax,
      },
    };
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }

  private onChange = () => { };

}
