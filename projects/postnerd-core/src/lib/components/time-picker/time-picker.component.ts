import { Component, OnInit, ChangeDetectorRef, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInput } from '../../../base/base-input';

@Component({
  selector: 'pn-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TimePickerComponent),
    },
  ],
})
export class TimePickerComponent extends BaseInput {

  @Input() min: Date;
  @Input() max: Date;
  @Input() placeholder = '';
  @Input() classInput: string;

  disabled: boolean;

  constructor(
    protected cdr: ChangeDetectorRef,
  ) {
    super(cdr);
  }

}
