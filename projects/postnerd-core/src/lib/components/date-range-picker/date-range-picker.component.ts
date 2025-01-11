import { Component, OnInit, HostBinding, Input, ChangeDetectorRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'pn-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DateRangePickerComponent),
    },
  ],
})
export class DateRangePickerComponent implements OnInit, ControlValueAccessor {
  @HostBinding('class') hostClass = 'base-control';

  @Input() min: Date;
  @Input() max: Date;
  @Input() autoTime = true; // 00:00:00
  @Input() placeholder = '';
  @Input() monthOnly: boolean;
  @Input() clearDate = false;
  @Input() disabled = false;

  dateRange: Date[] | undefined;

  bsConfig: Partial<BsDatepickerConfig> = {
    customTodayClass: '_today',
    showWeekNumbers: false,
    containerClass: 'theme-blue',
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY'
  };

  @Input() set format(format: string) {
    this.bsConfig.rangeInputFormat = format;
  }

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  onOpenCalendar(container) {
    if (this.monthOnly) {
      container.monthSelectHandler = (event: any): void => {
        container._store.dispatch(container._actions.select(event.date));
      };
      container.setViewMode('month');
    }
  }

  onValueChange(event) {
    if (event && event.length === 2) {
      const dateRange = event as [Date, Date];
      if (this.autoTime) {
        dateRange[0].setHours(0, 0, 0);
        dateRange[1].setHours(23, 59, 59);
      }
      this.dateRange = dateRange;
      this.onChange(dateRange);
    }
  }

  onClear() {
    this.dateRange = undefined;
    this.onChange(undefined);
  }

  writeValue(values: Date[]): void {
    // console.log('values', values);
    this.dateRange = values;
    this.cdr.markForCheck();
  }

  onBlur(event) {
    this.onTouched(event);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  private onChange = (_: any) => { };
  private onTouched = (_: any) => { };

}
