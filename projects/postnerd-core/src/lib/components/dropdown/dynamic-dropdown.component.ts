import { Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDropdown } from '../../../base/base-dropdown';
import { of } from 'rxjs';

@Component({
  selector: 'pn-dynamic-dropdown',
  templateUrl: '../../../base/base-dropdown/base-dropdown.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicDropdownComponent extends BaseDropdown<any> {

  @Input() list: any[];

  inputChanges = ['list'];

  @Input() set label(v: string) {
    this.textAttr = v;
  }

  constructor(protected cdr: ChangeDetectorRef) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected apiOptionListGet$() {
    return of(this.list);
  }
}

