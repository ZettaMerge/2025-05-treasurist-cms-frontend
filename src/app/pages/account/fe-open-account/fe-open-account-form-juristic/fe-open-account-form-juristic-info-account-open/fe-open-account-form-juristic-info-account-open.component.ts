import { Component, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'fe-open-account-form-juristic-info-account-open',
  templateUrl: './fe-open-account-form-juristic-info-account-open.component.html',
  styleUrls: ['./fe-open-account-form-juristic-info-account-open.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FeOpenAccountFormJuristicInfoAccountOpenComponent implements OnInit {


  addressDeliveryDocuments = [
    { id: 1, name: 'ตามหนังสือจดทะเบียนนิติบุุคคล', checked: true },
    { id: 2, name: 'อื่น ๆ', checked: false }];

  investList = [
    { id: 1, name: 'บริหารสภาพคล่อง', checked: false },
    { id: 2, name: 'การลงทุน', checked: false },
    { id: 3, name: 'บริหารเงินลงทุน', checked: false },
    { id: 4, name: 'อื่น ๆ', checked: false },
  ];
  receiveDocumentsList = [
    { id: 1, name: 'ตามอีเมล์', checked: false },
    { id: 2, name: 'ไปรษณีย์', checked: false },
    { id: 3, name: 'โทรสาร', checked: false },
  ];
  investOther: string;
  isInvestOther = true;
  isFax = true;
  constructor() { }

  ngOnInit(): void {
  }

  onChangCheckBoxAddress(event, data, index) {
    console.log('onChangCheckBoxAddressIdCard', event, index);

    this.addressDeliveryDocuments.forEach((value) => {
      console.log('value', value);
      if (value.id === data.id) {
        value.checked = event;
      } else {
        value.checked = false;
      }

    });

    console.log('addressLists', this.addressDeliveryDocuments);
  }

  onChangCheckBoxInvest(event, data, index) {
    this.investList.forEach((value) => {
      if (value.id === data.id) {
        value.checked = event;
      } else {
        value.checked = false;
      }

      if (value.name === 'อื่น ๆ' && value.checked === true) {
        this.isInvestOther = false;

      } else {
        this.isInvestOther = true;
      }
    });

    console.log('investList', this.investList);
    console.log('isInvestOther', this.isInvestOther);

  }

  onChangCheckBoxReceiveDocument(event, data, index) {
    this.receiveDocumentsList.forEach((value) => {
      if (value.id === data.id) {
        value.checked = event;
      } else {
        value.checked = false;
      }

      if (value.name === 'โทรสาร' && value.checked === true) {
        this.isFax = false;

      } else {
        this.isFax = true;
      }
    });

    console.log('investList', this.investList);
    console.log('isInvestOther', this.isInvestOther);

  }

}
