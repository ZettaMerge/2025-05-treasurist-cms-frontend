import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { BaseInput } from '../../../base/base-input';

@Component({
  selector: 'pn-time-range-picker',
  templateUrl: './time-range-picker.component.html',
  styleUrls: ['./time-range-picker.component.scss']
})
export class TimeRangePickerComponent extends BaseInput {

  @Input() start: any;
  @Input() end: any;
  @Input() placeholderStart: any;
  @Input() placeholderEnd: any;
  @Input() min: any;
  @Input() max: any;
  @Input() classInput: string;

  constructor(
    protected cdr: ChangeDetectorRef,
  ) {
    super(cdr);
  }
}
