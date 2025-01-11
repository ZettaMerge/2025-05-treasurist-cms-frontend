import {Component, Input, OnInit} from '@angular/core';
import {DropdownService, MasterAddressService} from '@api';
import * as _ from 'lodash';

@Component({
  selector: 'fe-form-account-form-current-address',
  templateUrl: './fe-form-account-form-current-address.component.html',
  styleUrls: ['./fe-form-account-form-current-address.component.scss']
})
export class FeFormAccountFormCurrentAddressComponent implements OnInit {

  @Input() data;

  country: string;

  constructor(
    protected dropdownService: DropdownService,
    protected masterAddressService: MasterAddressService,
  ) {
  }

  ngOnInit(): void {
    // this.data.country = 'TH';
    this.setDefaultOptions();
  }


  setDefaultOptions() {
    let country;
    this.dropdownService.dropdownCountryGet$().subscribe(data => {
      country = data;
      const countryOption = country.find(c => c.value === 'TH');
      console.log('countryOption', countryOption);
      this.country = countryOption;
      // this.data.country = countryOption.value;
    });
  }

  onSelectDropdown(event) {
    if (event) {
      console.log('event', event);
      this.data.country = event.value;
    } else {
      console.log('no event');
      this.data.country = 'TH';
    }
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
