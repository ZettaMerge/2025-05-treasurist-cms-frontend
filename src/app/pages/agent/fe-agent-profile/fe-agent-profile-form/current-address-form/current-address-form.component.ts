import {Component, Input, OnInit} from '@angular/core';
import {DropdownService} from '@api';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
  selector: 'current-address-form',
  templateUrl: './current-address-form.component.html',
  styleUrls: ['./current-address-form.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class CurrentAddressFormComponent implements OnInit {
  @Input() agentAddressData;
  @Input() canView;
  @Input() canCreate;

  country = 'ประเทศไทย';


  constructor(
    protected dropdownService: DropdownService,
  ) {
  }

  ngOnInit(): void {
  }


  onSubDistrictChange(event) {
    // this.data.postalCode = '';
    // if (event) {
    //   this.masterAddressService.dropdownPostalCodeGet$(_.toString(this.data.district), _.toString(this.data.province), _.toString(this.data.subDistrict)).subscribe( data => {
    //     console.log('data', data);
    //     this.data.postalCode = data ? data.toString() : null;
    //   });
    // }
  }

}
