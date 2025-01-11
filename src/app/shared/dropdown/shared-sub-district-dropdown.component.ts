import {Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseDropdown} from '@postnerd-core';
import {of} from 'rxjs';
import {AssetDropdownDTO, DropdownDTO} from '@model';
import {AssetService, DropdownService, MasterAddressService} from '@api';
import * as _ from 'lodash';

@Component({
  selector: 'shared-sub-district-dropdown',
  templateUrl: '../../../../projects/postnerd-core/src/base/base-dropdown/base-dropdown.html',
  // proje c ts/postn e rd-c o re/ s rc/b a se/b a se-dropd o wn/b a se-dropdown.html
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedSubDistrictDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedSubDistrictDropdownComponent extends BaseDropdown<any> {

  @Input() province: any;
  @Input() district: any;


  inputChanges = ['province', 'district'];
  isPrimitive = true;
  isOptionListPrimitive = true;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected masterAddressService: MasterAddressService,
  ) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }


  protected apiOptionListGet$() {

     if (this.province && !this.district) {
      return of([]);
    } else if (!this.district && !this.province) {
      return of([]);
    }

    return this.masterAddressService.dropdownSubDistrictGet$(_.toString(this.district), _.toString(this.province));

  }
}
