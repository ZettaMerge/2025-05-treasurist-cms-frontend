import { OnInit, Input, OnDestroy, Output, EventEmitter, Directive, HostBinding } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Directive()
export class BaseEnumRadio<T> implements OnInit, OnDestroy, ControlValueAccessor {

  @HostBinding('class') hostClass = 'base-control';

  @Input() controlClass: string;
  @Input() optionList: T[];

  @Output() loaded = new EventEmitter<T[]>();

  value: any;
  disabled: boolean;
  loading: boolean;

  private getOptionListSub: any;

  constructor() {
  }

  ngOnInit() {
    if (this.optionList) {
      this.loaded.emit(this.optionList);
    } else {
      this.getOptionList();
    }
  }

  ngOnDestroy() {
    if (this.getOptionListSub) {
      this.getOptionListSub.unsubscribe();
    }
  }

  onSelect() {
    this.onChange(this.value);
  }

  onLoaded() {
    this.loaded.emit(this.optionList);
  }

  reset() {
    this.value = undefined;
    this.onSelect();
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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private onChange = (_: any) => { };
  private onTouched = (_: any) => { };

  protected apiOptionListGet$(): Observable<T[]> {
    throw new Error('Method not implemented.');
  }

  protected getOptionList() {
    this.loading = true;
    this.getOptionListSub = this.apiOptionListGet$().pipe(
      finalize(() => this.loading = false),
    ).subscribe(data => {
      this.optionList = data;
      this.onLoaded();
    });
  }
}
