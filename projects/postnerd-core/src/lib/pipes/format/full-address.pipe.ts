import { Pipe, PipeTransform, OnChanges, SimpleChanges } from '@angular/core';

@Pipe({
  name: 'fullAddress'
})
export class FullAddressPipe implements PipeTransform {

  transform(address: any): unknown {
    // if (address && address.country && address.country.code !== 'TH') {
    //   return `${address.address} ${address.country.name.th}`;
    // } else if (address) {
    //   return `${address.address} ${address.subDistrict?.name.th} ${address.district?.name.th} ${address.province?.name.th} ${address.zipCode}`;
    // }
    if (address) {
      return `${address.address} ${address.subDistrict?.name.th} ${address.district?.name.th} ${address.province?.name.th} ${address.zipCode}`;
    }
    return '';
  }

}
