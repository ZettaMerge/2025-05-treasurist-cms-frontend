import { Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDropdown } from '@postnerd-core';
import { of } from 'rxjs';
import { AssetDropdownDTO } from '@model';
import { AssetService } from '@api';

@Component({
  selector: 'shared-asset-without-fund-mapping-dropdown',
  templateUrl: '../../../../projects/postnerd-core/src/base/base-dropdown/base-dropdown.html',
  // proje c ts/postn e rd-c o re/ s rc/b a se/b a se-dropd o wn/b a se-dropdown.html
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedAssetWithoutFundMappingDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedAssetWithoutFundMappingDropdownComponent extends BaseDropdown<AssetDropdownDTO> {

  // textAttr = 'thName';
  @Input() fcnAccountId;
  textAttr = 'amcCode';
  inputChanges = [`fcnAccountId`];
  constructor(
    protected cdr: ChangeDetectorRef,
    protected assetService: AssetService,
  ) {
    super(cdr);
  }

  ngOnInit() {
    console.log('fcnAccountId', this.fcnAccountId);
    super.ngOnInit();
  }

  protected apiOptionListGet$() {
    console.log('fcnAccountId', this.fcnAccountId);
    return this.assetService.assetFundMappingDropdownWithoutFundMappingGet$();
  }
}
