import {Component, OnInit, Input} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'shared-view-legal-entity-account-list-juristic-person',
  templateUrl: './shared-view-legal-entity-account-list-juristic-person.component.html',
  styleUrls: ['./shared-view-legal-entity-account-list-juristic-person.component.scss']
})
export class SharedViewLegalEntityAccountListJuristicPersonComponent implements OnInit {

  @Input() data: any;
  date = '2021-07-21T06:22:38.507Z';

  staffData = [
    {name: 'ศุกณพัฒน์ จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '3214567890', signAuthority: true, executive: true},
    {name: 'สุรศักดิ์ จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '23456890', signAuthority: true, executive: false},
    {name: 'ภาคศิริ ธนพัชรศิริ', national: 'ไทย', idType: 'ID Card', idNo: '09878656', signAuthority: false, executive: false},
    {name: 'เกรียงไกร จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '0986876', signAuthority: false, executive: false},
    {name: 'มีนา จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '231456789', signAuthority: true, executive: false},
  ];

  nameList = [
    {name: 'บริษัทหลักทรัพย์ที่ปรึกษาการลงทุนเทรเชอร์ริสต์ จำกัด', tel: '09897687', national: 'Thai', type: 'business'},
    {name: 'ศุกณพัฒน์ จิรวุฒิตานันท์', tel: '09897687', national: 'Thai', type: 'individual'},
    {name: 'ภาคศิริ ธนพัชรศิริ', tel: '09897687', national: 'Thai', type: 'individual'},
    {name: 'สุรศักดิ์ จิรวุฒิตานันท์', tel: '09897687', national: 'Thai', type: 'individual'},
  ];


  constructor() {
  }

  ngOnInit(): void {
  }

  convertDate(date) {
    if (date) {
      const convertDate = moment(date, 'YYYYMMDD');
      date = convertDate.format('DD/MM/YYYY');
      return date;
    } else {
      date = '-';
      return date;
    }
  }


}
