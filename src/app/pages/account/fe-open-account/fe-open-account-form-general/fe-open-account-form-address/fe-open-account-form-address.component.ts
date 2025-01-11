import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {DropdownService, MasterAddressService} from '@api';
import * as _ from 'lodash';

@Component({
  selector: 'fe-open-account-form-address',
  templateUrl: './fe-open-account-form-address.component.html',
  styleUrls: ['./fe-open-account-form-address.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FeOpenAccountFormAddressComponent implements OnInit {

  @Input() data;

  country: string;

  constructor(
    protected dropdownService: DropdownService,
    protected masterAddressService: MasterAddressService,
  ) {
  }

  ngOnInit(): void {
    this.data.country = 'TH';
    this.setDefaultOptions();
  }


  setDefaultOptions() {
    let country;
    this.dropdownService.dropdownCountryGet$().subscribe(data => {
      country = data;
      const countryOption = country.find(c => c.value === 'TH');
      console.log('countryOption', countryOption);
      this.country = countryOption;
      this.data.country = countryOption.value;
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
