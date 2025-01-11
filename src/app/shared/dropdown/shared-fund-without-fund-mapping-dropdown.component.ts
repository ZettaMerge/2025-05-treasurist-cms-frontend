import { Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDropdown } from '@postnerd-core';
import { of } from 'rxjs';
import { FundDropdownDTO } from '@model';
import { FundService } from '@api';
import * as _ from 'lodash';
@Component({
  selector: 'shared-fund-without-fund-mapping-dropdown',
  templateUrl: '../../../../projects/postnerd-core/src/base/base-dropdown/base-dropdown.html',
  // proje c ts/postn e rd-c o re/ s rc/b a se/b a se-dropd o wn/b a se-dropdown.html
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedFundWithoutFundMappingDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFundWithoutFundMappingDropdownComponent extends BaseDropdown<FundDropdownDTO> {

  @Input() amc;
  @Input() fcnAccountId;
  @Input() isActive;

  textAttr = 'fundCode';
  inputChanges = ['amc', 'fcnAccountId', 'isActive'];

  constructor(
    protected cdr: ChangeDetectorRef,
    protected fundService: FundService,
  ) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();

  }

  protected apiOptionListGet$() {
    // console.log('amc apiOptionListGet', this.amc);
    // console.log('fcnAccountId fund', this.fcnAccountId);
    const isObject = _.isObject(this.amc);
    // console.log('isObject', isObject);
    console.log('isActive', this.isActive);
    return this.fundService.fundWithOutFundMappingDropdownGet$(isObject ? this.amc?.amcCode : this.amc, this.fcnAccountId, this.isActive ? this.isActive : undefined);
  }
}
