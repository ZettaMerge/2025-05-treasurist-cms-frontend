import {Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseDropdown} from '@postnerd-core';
import {of} from 'rxjs';
import {AssetDropdownDTO, BankDTO, DropdownDTO} from '@model';
import {AssetService, DropdownService, MasterBankService} from '@api';

@Component({
  selector: 'shared-bank-dropdown',
  templateUrl: '../../../../projects/postnerd-core/src/base/base-dropdown/base-dropdown.html',
  // proje c ts/postn e rd-c o re/ s rc/b a se/b a se-dropd o wn/b a se-dropdown.html
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedBankDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedBankDropdownComponent extends BaseDropdown<BankDTO> {

  // @Input() isOptionListPrimitive: boolean;

  textAttr = 'thName';
  // textAttr;
  // isPrimitive = true;
  // isOptionListPrimitive = true;
  // data: any;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected dropdownService: MasterBankService,
  ) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }


  protected apiOptionListGet$() {
    return this.dropdownService.dropdownBankGet$();
  }
}
