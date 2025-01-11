import { OnInit, Input, OnDestroy, Output, EventEmitter, HostBinding, Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Directive()
export class BaseRadio<T> implements OnInit, OnDestroy, ControlValueAccessor {

  @HostBinding('class') hostClass = 'base-control';

  @Input() controlClass: string;
  @Input() optionList: T[];
  @Input() showAll: boolean | string;
  @Input() isPrimitive = false;
  @Input() isVertical: boolean;
  @Input() lang: 'th' | 'en';

  @Output() loaded = new EventEmitter<T[]>();

  idAttr = 'id';
  textAttr = 'name';
  thTextAttr = 'nameTH';
  enTextAttr = 'nameEN';
  textFilter: string;

  value: any;
  disabled: boolean;
  loading: boolean;

  showAllText: string;
  showAllValue: string;

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
    if (this.isPrimitive) {
      this.onChange(this.value);
    } else if (this.optionList) {
      this.onChange(this.optionList.find(option => option[this.idAttr] === this.value));
    }
  }

  onLoaded() {
    this.loaded.emit(this.optionList);
  }

  reset() {
    this.value = undefined;
    this.onSelect();
  }

  writeValue(value: any): void {
    if (this.isPrimitive || value === undefined || value === null) {
      this.value = value;
    } else {
      this.value = value[this.idAttr];
    }
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
      if (this.lang) {
        this.optionList.forEach(m => {
          m[this.textAttr] = m[this[`${this.lang}TextAttr`]];
        });
      }
      if (this.showAll) {
        if (typeof this.showAll === 'string') {
          this.showAllText = this.showAll;
        }
        this.optionList = [{
          [this.idAttr]: this.showAllValue,
          [this.textAttr]: this.showAllText,
        } as any].concat(this.optionList);
      }
      this.onLoaded();
    });
  }

}
