import { Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDropdown } from '@postnerd-core';
import { of } from 'rxjs';
import { AssetDropdownDTO, DropdownDTO } from '@model';
import { AssetService, DropdownService, OrderService } from '@api';

@Component({
  selector: 'shared-order-type-dropdown',
  templateUrl: '../../../../projects/postnerd-core/src/base/base-dropdown/base-dropdown.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedOrderTypeDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedOrderTypeDropdownComponent extends BaseDropdown<any> {
  showAllText = 'ทั้งหมด';
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
    return this.dropdownService.dropdownTransactionTypeGet$();
  }
}
