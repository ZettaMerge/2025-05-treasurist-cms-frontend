import { OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectorRef, Directive, HostBinding, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

@Directive()
export class BaseDropdown<T> implements OnChanges, OnInit, OnDestroy, ControlValueAccessor {

  @HostBinding('class') hostClass = 'base-control';

  @Input() controlClass: string;
  @Input() placeholder: string;
  @Input() compareWith: (o1: any, o2: any) => boolean;
  @Input() isPrimitive = false;
  @Input() isError = false;
  @Input() isValid = false;
  @Input() name: string;
  @Input() required: boolean;
  @Input() multiple: boolean;
  @Input() findWithName: boolean;
  @Input() clearable = true;
  @Input() searchable = true;
  @Input() autoReset = false;

  @Output() loaded = new EventEmitter<T[]>();

  optionList: T[];
  isOptionListPrimitive = false;

  idAttr = 'id';
  textAttr = 'name';
  thTextAttr = 'nameTH';
  enTextAttr = 'nameEN';
  value: T | T[] | undefined;
  disabled: boolean;
  loading: boolean;

  enumTextLabel: any;

  _showAll: boolean;
  showAllText = 'ทั้งหมด';
  showAllValue = undefined;

  inputChanges = [] as string[];

  private getOptionListSub: any;

  @Input() set showAll(showAll: boolean | string) {
    this._showAll = !showAll;
    if (this._showAll && typeof showAll === 'string') {
      this.showAllText = showAll as string;
    }
  }

  get showAll() {
    return this._showAll;
  }

  compareFn = (o1: any, o2: any): boolean => {
    return o1 && o2 ? o1[this.idAttr] === o2[this.idAttr] : o1 === o2;
  }

  compareFnBothPrimitive = (o1: any, o2: any): boolean => {
    return o1 === o2;
  }

  constructor(
    protected cdr: ChangeDetectorRef,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.inputChanges.some(input => changes[input] && !changes[input].firstChange)) {
      if (this.autoReset) {
        this.reset();
      }
      this.getOptionList();
    }
  }

  ngOnInit() {
    this.setDefaultCompareWith();
    this.getOptionList();
  }

  ngOnDestroy() {
    if (this.getOptionListSub) {
      this.getOptionListSub.unsubscribe();
    }
  }

  displayOption(option) {
    if (this.isOptionListPrimitive) {
      return option;
    } else {
      return this.textAttr.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null;
      }, option || self);
    }
  }

  displayOptionEnum(enumKey, enumText) {
    return Object.keys(enumKey).map(key => {
      return { id: enumKey[key], name: enumText[enumKey[key]] };
    });
  }

  onSelect(event) {
    const indexShowAll = _.findIndex(this.value, v => _.isUndefined(v[this.idAttr]));
    if (this._showAll && this.multiple && indexShowAll > -1) {
      if (indexShowAll === 0) {
        if (Array.isArray(this.value) && this.value.length > 1) {
          this.value = _.filter(this.value, v => !_.isUndefined(v[this.idAttr]));
        }
      } else {
        if (Array.isArray(this.value) && this.value.length > 1) {
          this.value = _.filter(this.value, v => _.isUndefined(v[this.idAttr]));
          console.log(' this.value');
        }
      }
    }

    if (this.isOptionListPrimitive === this.isPrimitive) {
      this.onChange(this.value);
    } else if (this.isPrimitive) {
      // convert to flat value
      if (this.multiple) {
        const values = _.chain(this.value)
          .map(v => (v ? v[this.idAttr] : v))
          .compact()
          .join(',')
          .value();
        this.onChange(values);
      } else {
        this.onChange(this.value ? this.value[this.idAttr] : this.value);
      }
    } else {
      // convert to object value
      this.onChange({ [this.idAttr]: this.value });
    }
  }

  onBlur(event) {
    this.onTouched(event);
  }

  reset() {
    if (this._showAll) {
      this.value = { id: undefined, name: this.showAllText } as unknown as T;
    } else {
      this.value = undefined;
    }
    // window.setTimeout(() => {
    //   this.onSelect();
    // });
  }

  writeValue(value: any): void {
    if (value === undefined || value === null) {
      if (this._showAll && !this.multiple) {
        this.value = { name: 'ทั้งหมด', id: null } as any;
      } else {
        this.value = value;
      }
    } else if (this.isOptionListPrimitive === this.isPrimitive) {
      this.value = value;
      if (this.findWithName && this.value && this.value[this.textAttr]) {
        const findObject = _.find(this.optionList, (o) => o[this.textAttr] === this.value[this.textAttr]);
        if (findObject) {
          this.value = findObject;
          // this.onSelect(findObject);
          this.onChange(this.value);
        }
      }

      if (this.value && this.value[this.idAttr]) {
        const findObject = _.find(this.optionList, (o) => o[this.idAttr] === this.value[this.idAttr]);
        if (findObject && !_.isEqual(this.value, findObject)) {
          this.value = findObject;
          this.onChange(this.value);
        }
      }

    } else if (this.isPrimitive) {
      // convert to object value
      this.value = { [this.idAttr]: value, [this.textAttr]: this.enumTextLabel ? this.enumTextLabel[value] : value } as T;
      if (this.multiple) {
        this.value = [this.value as T] as T[];
      }
    } else {
      // convert to flat value
      this.value = value[this.idAttr] as any;
    }

    this.cdr.markForCheck();
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

  protected setDefaultCompareWith() {
    if (!this.compareWith) {
      if (this.isOptionListPrimitive && this.isPrimitive) {
        this.compareWith = this.compareFnBothPrimitive;
      } else {
        this.compareWith = this.compareFn;
      }
    }
  }

  protected apiOptionListGet$(): Observable<T[]> {
    throw new Error('Method not implemented.');
  }

  protected getOptionList() {
    this.loading = true;
    this.getOptionListSub = this.apiOptionListGet$().pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      }),
    ).subscribe(data => {
      this.optionList = data;
      if (this._showAll) {
        const showAllOption: T[] = [{ id: undefined, name: this.showAllText } as unknown as T];
        this.optionList = showAllOption.concat(this.optionList);
      }

      if (this.value && this.value[this.idAttr]) {
        const findObject = _.find(this.optionList, (o) => o[this.idAttr] === this.value[this.idAttr]);
        if (findObject && !_.isEqual(this.value, findObject)) {
          this.value = findObject;
          this.onChange(this.value);
        }
      }

      if (this.findWithName && this.value && this.value[this.textAttr]) {
        const findObject = _.find(this.optionList, (o) => o[this.textAttr] === this.value[this.textAttr]);
        if (findObject) {
          this.value = findObject;
          this.onChange(this.value);
        }
      }

      this.loaded.emit(this.optionList);
    });
  }

}
