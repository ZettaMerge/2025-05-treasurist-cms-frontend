import { Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDropdown } from '@postnerd-core';
import { of } from 'rxjs';
import { AssetDropdownDTO, DropdownDTO } from '@model';
import { AssetService, DropdownService, OrderService } from '@api';

@Component({
  selector: 'shared-status-dropdown',
  templateUrl: '../../../../projects/postnerd-core/src/base/base-dropdown/base-dropdown.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedStatusDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedStatusDropdownComponent extends BaseDropdown<any> {
  showAllText = 'ทั้งหมด';
  isPrimitive = true;
  isOptionListPrimitive = true;
  constructor(
    protected cdr: ChangeDetectorRef,
    protected dropdownService: OrderService,
  ) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected apiOptionListGet$() {
    return this.dropdownService.dropdownStatusGet$();
  }
}
