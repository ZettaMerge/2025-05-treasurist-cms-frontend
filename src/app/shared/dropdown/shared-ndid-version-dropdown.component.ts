import { Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDropdown } from '@postnerd-core';
import { of } from 'rxjs';
import { AssetDropdownDTO, ContentDTO } from '@model';
import { AssetService, ContentService } from '@api';

@Component({
  selector: 'shared-ndid-version-dropdown',
  templateUrl: '../../../../projects/postnerd-core/src/base/base-dropdown/base-dropdown.html',
  // proje c ts/postn e rd-c o re/ s rc/b a se/b a se-dropd o wn/b a se-dropdown.html
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedNdidVersionDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedNdidVersionDropdownComponent extends BaseDropdown<ContentDTO> {

  // textAttr = 'thName';
  @Input() contentType: string;
  textAttr = 'version';

  constructor(
    protected cdr: ChangeDetectorRef,
    protected ndidService: ContentService,
  ) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected apiOptionListGet$() {
    return this.ndidService.contentDropDownGet$('TERM_NDID');
  }
}
