import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import {OpenAccountDTO} from '@model';

export interface OpenAccountInfo {
  nameTh: string;
  nameEn: string;
  registerCountry: string;
  registrationCertificateNumber: number;
  taxpayerIdentificationNumber: number;
  branch: string;
  totalIncome: string;
  applicationForm: string;
  registerDate: string;
  businessType: string;
  propertyValue: string;
  shareholder: string;
  termsOfSigning: string;
  nameContact: string;
  position: string;
  phoneNumber: string;
  fax: string;
  email: string;
}
@Component({
  selector: 'fe-open-account-form-juristic-info',
  templateUrl: './fe-open-account-form-juristic-info.component.html',
  styleUrls: ['./fe-open-account-form-juristic-info.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FeOpenAccountFormJuristicInfoComponent implements OnInit {
  @Input() data: OpenAccountDTO = {} as OpenAccountDTO;
  dataJuristicInfo: OpenAccountInfo = {} as OpenAccountInfo;
  lists = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
