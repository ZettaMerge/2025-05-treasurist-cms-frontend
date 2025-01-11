import { Component, OnInit, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import * as _ from 'lodash';


@Component({
  selector: 'pn-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatePickerComponent),
    },
  ],
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {

  @Input() min: Date;
  @Input() max: Date;
  @Input() autoTime = true; // 00:00:00
  @Input() placeholder = '';
  @Input() monthOnly: boolean;
  @Input() disabled: boolean;
  @Input() disabledDates: Date[];
  @Input() daysDisabled: number[];
  @Input() datesEnabled: Date[];
  // datesEnabled: Date[] = [moment().toDate()];
  date: Date | undefined;

  bsConfig: Partial<BsDatepickerConfig> = {
    customTodayClass: '_today',
    showWeekNumbers: false,
  };

  @Input() set format(format: string) {
    this.bsConfig.dateInputFormat = format;
  }

  constructor(
    private localeService: BsLocaleService,
    private cdr: ChangeDetectorRef,
  ) {
    this.localeService.use('th');
  }

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
    if (event) {
      const isValidDate = moment(event).isValid();
      if (isValidDate) {
        const date = event;
        if (this.autoTime) {
          date.setHours(0, 0, 0);
        }
        this.date = date;
        this.onChange(date);
      } else {
        this.onChange(null);
      }
    } else {
      this.onChange(null);
    }
  }

  onClear() {
    this.date = undefined;
    this.onChange(undefined);
  }

  writeValue(value: any): void {
    if (_.isString(value)) {
      this.date = moment(value, 'YYYY-MM-DD').toDate();
    } else {
      if (moment(value).isValid()) {
        this.date = value || undefined;
      } else {
        this.date = undefined;
      }
    }
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
