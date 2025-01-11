import { Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDropdown } from '@postnerd-core';
import { of } from 'rxjs';
import {AimcCategoryDTO, AssetDropdownDTO, AssetTypeDTO} from '@model';
import {AssetService} from '@api';

@Component({
  selector: 'shared-aimc-dropdown',
  templateUrl: '../../../../projects/postnerd-core/src/base/base-dropdown/base-dropdown.html',
  // proje c ts/postn e rd-c o re/ s rc/b a se/b a se-dropd o wn/b a se-dropdown.html
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedAimcDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedAimcDropdownComponent extends BaseDropdown<AimcCategoryDTO> {

  // textAttr = 'thName';
  textAttr = 'aimcName';

  constructor(
    protected cdr: ChangeDetectorRef,
    protected assetService: AssetService,
  ) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected apiOptionListGet$() {
    return this.assetService.aimcDropdownGet$();
  }
}
