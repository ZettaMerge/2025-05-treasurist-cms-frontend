import {Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseDropdown} from '@postnerd-core';
import {of} from 'rxjs';
import {AssetDropdownDTO, DropdownDTO} from '@model';
import {AgentService, AssetService, DropdownService, MasterAddressService} from '@api';

@Component({
  selector: 'shared-ic-license-dropdown',
  templateUrl: '../../../../projects/postnerd-core/src/base/base-dropdown/base-dropdown.html',
  // proje c ts/postn e rd-c o re/ s rc/b a se/b a se-dropd o wn/b a se-dropdown.html
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedIcLicenseDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedIcLicenseDropdownComponent extends BaseDropdown<any> {


  textAttr;
  isPrimitive = true;
  isOptionListPrimitive = true;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected agentService: AgentService,
  ) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }


  protected apiOptionListGet$() {

    return this.agentService.agentIcLicenseDropdownGet$();

  }
}
