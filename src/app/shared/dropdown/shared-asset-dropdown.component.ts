import { Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDropdown } from '@postnerd-core';
import { of } from 'rxjs';
import { AssetDropdownDTO } from '@model';
import { AssetService } from '@api';

@Component({
  selector: 'shared-asset-dropdown',
  templateUrl: '../../../../projects/postnerd-core/src/base/base-dropdown/base-dropdown.html',
  // proje c ts/postn e rd-c o re/ s rc/b a se/b a se-dropd o wn/b a se-dropdown.html
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedAssetDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedAssetDropdownComponent extends BaseDropdown<AssetDropdownDTO> {

  // textAttr = 'thName';
  @Input() fcnAccountId;
  @Input() amcCode;
  textAttr = 'amcCode';
  inputChanges = [`fcnAccountId`];
  datas;
  datasddd;
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
    // this.assetService.assetDropdownGet$(this.fcnAccountId).subscribe(data => {
    //   this.datas = data.map((obj) => {
    //     return { id: obj.id, name: obj.amcCode };
    //   });
    //   return this.datas;

    // });
    // console.log('this.datas', this.datas);
    // return of(this.datas);
    return this.assetService.assetFundMappingDropdownGet$(this.fcnAccountId);
  }
}
