import {Component, Input, OnInit} from '@angular/core';
import {AccountService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {BankAccountDTO} from '@model';

@Component({
  selector: 'fe-customer-bank-account',
  templateUrl: './fe-customer-bank-account.component.html',
  styleUrls: ['./fe-customer-bank-account.component.scss']
})
export class FeCustomerBankAccountComponent implements OnInit {

  @Input() data;

  bankAccountData: BankAccountDTO = {} as BankAccountDTO;
  dataSub: Subscription;
  date = '2021-07-21T06:22:38.507Z';
  accData = [
    {bankName: '014 SCB ธนาคารไทยพาณิชย์ จำกัด (มหาชน)' , bankNo: '0001 เซ็นทรัลพลาซ่า แกรนด์ พระราม 9', accountNumber: '11235678'},
    {bankName: '014 SCB ธนาคารไทยพาณิชย์ จำกัด (มหาชน)' , bankNo: '0004 สาขา ซีคอนบางแค', accountNumber: '98098798'},
    {bankName: '004 KBANK ธนาคารกสิกรไทย จำกัด (มหาชน)' , bankNo: '0001 เซ็นทรัลพลาซ่า แกรนด์ พระราม 9', accountNumber: '096457342'},
  ];
  constructor(
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getBankAccountById();
  }

  getBankAccountById() {

    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.accountService.accountBankIdGet$(this.data.id).subscribe(data => {
      this.bankAccountData = data;
      this.spinner.hide('global');
      console.log('data getBankAccountById', this.bankAccountData);
    });
  }

}
