import { Input, HostBinding, ChangeDetectorRef, Directive, ViewChild, ElementRef, AfterViewInit, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
export class BaseInput implements ControlValueAccessor, AfterViewInit {

  @HostBinding('class') hostClass = 'base-control';

  @ViewChild('input') input: ElementRef<any>;

  @Input() placeholder = '';
  @Input() maxlength: number;
  @Input() autofocus: boolean | '';
  @Input() name: string;
  @Input() required: boolean;
  @Input() disabled = false;

  value: any;

  constructor(
    protected cdr?: ChangeDetectorRef,
  ) {
  }

  ngAfterViewInit() {
    if (this.input && (this.autofocus || this.autofocus === '')) {
      this.input.nativeElement.focus();
    }
  }

  onValueChange(value) {
    this.value = value;
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.cdr) {
      this.cdr.markForCheck();
    }
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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  private onChange = (_: any) => { };
  private onTouched = (_: any) => { };

}
