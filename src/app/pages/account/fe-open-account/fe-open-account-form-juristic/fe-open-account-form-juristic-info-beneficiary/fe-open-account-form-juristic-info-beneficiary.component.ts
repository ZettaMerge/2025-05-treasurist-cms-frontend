import { Component, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

export interface BeneficiaryInformation {
  name: string;
  dateBirthday: string;
  proofType: string;
  idCardNumber: number;
  cardExpirationDate: number;
  country: string;
}
@Component({
  selector: 'fe-open-account-form-juristic-info-beneficiary',
  templateUrl: './fe-open-account-form-juristic-info-beneficiary.component.html',
  styleUrls: ['./fe-open-account-form-juristic-info-beneficiary.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FeOpenAccountFormJuristicInfoBeneficiaryComponent implements OnInit {
  dataBeneficiary: BeneficiaryInformation = {} as BeneficiaryInformation;
  lists = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
