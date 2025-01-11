import { Component, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import * as _ from 'lodash';
export interface MutualFundTransaction {
  name: string;
  dateBirthday: string;
  proofType: string;
  idCardNumber: number;
  cardExpirationDate: number;
  country: string;
  termsOfSigningTransaction: string;
}

@Component({
  selector: 'fe-open-account-form-juristic-info-mutual-fund-transaction',
  templateUrl: './fe-open-account-form-juristic-info-mutual-fund-transaction.component.html',
  styleUrls: ['./fe-open-account-form-juristic-info-mutual-fund-transaction.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FeOpenAccountFormJuristicInfoMutualFundTransactionComponent implements OnInit {
  dataMutualFundTransaction: MutualFundTransaction = {} as MutualFundTransaction;
  isAddressIdCard = false;
  isOtherAddress = false;
  lists = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
  ];

  isCheckedOther;
  addressLists = [
    { id: 1, name: 'ตามบัตรประชาชน', checked: true },
    { id: 2, name: 'อื่น ๆ', checked: false },
  ];
  currentlyChecked = this.addressLists;
  constructor() { }

  ngOnInit(): void {
  }

  onChangCheckBoxAddress(event, data, index) {
    console.log('onChangCheckBoxAddressIdCard', event, index);

    this.addressLists.forEach((value) => {
      if (value.id === data.id) {
        value.checked = event;
      } else {
        value.checked = false;
      }
    });

    console.log('addressLists', this.addressLists);

    // const select = _.find(this.addressLists, ['checked', true]);
    // console.log('select', select.name);

  }

  onChangCheckBoxOtherAddress(event) {
  }

}
