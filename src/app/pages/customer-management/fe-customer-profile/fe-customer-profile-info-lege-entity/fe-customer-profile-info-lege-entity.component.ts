import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'fe-customer-profile-info-lege-entity',
  templateUrl: './fe-customer-profile-info-lege-entity.component.html',
  styleUrls: ['./fe-customer-profile-info-lege-entity.component.scss']
})
export class FeCustomerProfileInfoLegeEntityComponent implements OnInit {
  @Input() data;
  statusFx = true;
  statusCommo = false;
  date = '2021-07-21T06:22:38.507Z';

  staffData = [
    { name: 'ศุกณพัฒน์ จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '3214567890', signAuthority: true, executive: true },
    { name: 'สุรศักดิ์ จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '23456890', signAuthority: true, executive: false },
    { name: 'ภาคศิริ ธนพัชรศิริ', national: 'ไทย', idType: 'ID Card', idNo: '09878656', signAuthority: true, executive: false },
    { name: 'เกรียงไกร จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '0986876', signAuthority: true, executive: false },
    { name: 'มีนา จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '231456789', signAuthority: true, executive: false },
  ];

  nameList = [
    { name: 'บริษัทหลักทรัพย์ที่ปรึกษาการลงทุนเทรเชอร์ริสต์ จำกัด', tel: '09897687', national: 'Thai', type: 'business' },
    { name: 'ศุกณพัฒน์ จิรวุฒิตานันท์', tel: '09897687', national: 'Thai', type: 'individual' },
    { name: 'ภาคศิริ ธนพัชรศิริ', tel: '09897687', national: 'Thai', type: 'individual' },
    { name: 'สุรศักดิ์ จิรวุฒิตานันท์', tel: '09897687', national: 'Thai', type: 'individual' },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
