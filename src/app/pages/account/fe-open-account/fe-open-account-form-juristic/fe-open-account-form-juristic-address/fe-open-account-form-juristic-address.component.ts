import { Component, OnInit } from '@angular/core';
import {DropdownService} from "@api";

export interface AddressInfo {
  houseNo: string;
  villageNo: string;
  building: string;
  roomNumber: string;
  floor: string;
  lane: string;
  road: string;
  subDistrict: string;
  district: string;
  province: string;
  zipCode: string;
  country: string;

}
@Component({
  selector: 'fe-open-account-form-juristic-address',
  templateUrl: './fe-open-account-form-juristic-address.component.html',
  styleUrls: ['./fe-open-account-form-juristic-address.component.scss']
})
export class FeOpenAccountFormJuristicAddressComponent implements OnInit {
  addressInfoData: AddressInfo = {} as AddressInfo;

  subDistrictLists = [
    { id: 1, name: 'เขตคลองเตย' },
  ];
  districtLists = [
    { id: 1, name: 'คลองตัน' },
  ];

  countryList = [
    { id: 1, name: 'ไทย' },
  ];
  constructor(
    protected dropdownService: DropdownService,
  ) { }

  ngOnInit(): void {
    this.setDefaultOptions();
  }

  setDefaultOptions() {
    let country;

    this.dropdownService.dropdownCountryGet$().subscribe(data => {
      country = data;

      const countryOption = country.find(c => c.id === 218);
      console.log('countryOption', countryOption);
      this.addressInfoData.country = countryOption;
    });
  }

  onSelectDropdown(event) {

  }

}
