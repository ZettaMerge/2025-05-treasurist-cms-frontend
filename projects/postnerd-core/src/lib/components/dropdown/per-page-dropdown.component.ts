import { Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDropdown } from '../../../base/base-dropdown';
import { of } from 'rxjs';

@Component({
  selector: 'pn-per-page-dropdown',
  templateUrl: '../../../base/base-dropdown/base-dropdown.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PerPageDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerPageDropdownComponent extends BaseDropdown<any> {

  @Input() list: any[];

  inputChanges = ['list'];
  isPrimitive = true;
  isOptionListPrimitive = true;
  clearable = false;
  searchable = false;
  hostClass = 'base-dropdown _per-page';

  constructor(protected cdr: ChangeDetectorRef) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // displayOption(option) {
  //   return `${option} per page`;
  // }

  protected apiOptionListGet$() {
    return of(this.list);
  }

}
