import { Component, OnInit, forwardRef, Input } from '@angular/core';
import * as _ from 'lodash';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'pn-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ToggleComponent),
    },
  ],
})
export class ToggleComponent implements OnInit, ControlValueAccessor {

  @Input() class: any;
  @Input() toggleLeftClass: string;

  value: any | undefined;
  disabled: boolean;

  isToggle = true;
  toggleID = `toggle-${_.random(0, 9999)}`;

  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
    this.value = !this.value;
    this.onChange(this.value);
  }

  onValueChange(value) {
    this.value = value;
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private onChange = (__: any) => { };
  private onTouched = (__: any) => { };

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pn-toggle-left',
  template: '<ng-content></ng-content>'
})
export class ToggleLeftComponent { }

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pn-toggle-right',
  template: '<ng-content></ng-content>'
})
export class ToggleRightComponent { }
