import {Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseDropdown} from '@postnerd-core';
import {of} from 'rxjs';
import {AssetDropdownDTO, DropdownDTO, TeamDropdownDTO} from '@model';
import {AssetService, DropdownService, TeamService} from '@api';

@Component({
  selector: 'shared-team-dropdown',
  templateUrl: '../../../../projects/postnerd-core/src/base/base-dropdown/base-dropdown.html',
  // proje c ts/postn e rd-c o re/ s rc/b a se/b a se-dropd o wn/b a se-dropdown.html
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedTeamDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTeamDropdownComponent extends BaseDropdown<TeamDropdownDTO> {


  textAttr = 'name';


  constructor(
    protected cdr: ChangeDetectorRef,
    private teamService: TeamService,
  ) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }


  protected apiOptionListGet$() {
    return this.teamService.dropdownTeamGet$();
  }
}
