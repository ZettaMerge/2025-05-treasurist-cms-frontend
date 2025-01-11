import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '@postnerd-core';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService, CustomerService, MasterBankService } from '@api';
import { BankAccountDTO, BankRedemptionDTO, BankSubscriptionDTO, OpenAccountDTO, UnitHolderDTO } from '@model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fe-customer-plan',
  templateUrl: './fe-customer-plan.component.html',
  styleUrls: ['./fe-customer-plan.component.scss']
})
export class FeCustomerPlanComponent implements OnInit {

  @Input() data;
  @ViewChild('detailfileModal') detailfileModal: ModalComponent;
  @Input() account: boolean;
  @Input() customer: boolean;
  @Input() planName: string;

  accountData: OpenAccountDTO = {} as OpenAccountDTO;
  unitHolderData: any;
  bankSubscriptionData: BankSubscriptionDTO = {} as BankSubscriptionDTO;
  bankRedemptionData: BankRedemptionDTO = {} as BankRedemptionDTO;
  userId: any;
  mode: string;
  fileType: string;
  accountFile: any;

  inVestData = [];
  unitList = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ];

  statusFx = true;
  statusCommo = false;

  constructor(
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private customerService: CustomerService,
    private toastrService: ToastrService,
    protected dropdownBankService: MasterBankService,
  ) {
  }

  ngOnInit(): void {
    if (this.data.id) {
      this.getAccountId();
      console.log('data', this.data);
    }
  }

  getAccountId() {
    this.spinner.show('global');

    this.customerService.customerIdInfoGet$(this.data.id).subscribe(data => {
      console.log('accountId', data);
      if (data.accountId) {
        this.accountService.openAccountDetailIdGet$(data.accountId).subscribe(accData => {
          console.log('acc Data', accData);
          this.accountData = accData;
          this.userId = data.userId;

          if (accData.investmentObjective) {
            console.log('inves obj', accData.investmentObjective);
            const convertInvestJson = accData.investmentObjective.split(',');
            convertInvestJson.forEach(incomeSource => {
              this.inVestData.push({ name: incomeSource });
            });
          }

          if (this.planName) {
            this.customerService.customerUnitHolderGet$(this.planName).subscribe(unitHolder => {
              console.log('da unitHolder', unitHolder);
              this.unitHolderData = unitHolder;
            });

            this.accountService.accountSyncBackAccountByFCNXCodeGet$(this.planName).subscribe(bankAccount => {
              this.bankRedemptionData = bankAccount.bankAccountPage.bankRedemption;
              this.bankSubscriptionData = bankAccount.bankAccountPage.bankSubscription;

              console.log('data bankAccount', bankAccount);
              console.log('data bankAccount', this.bankRedemptionData);
              console.log('data bankAccount', this.bankSubscriptionData);
              // console.log('data getBankAccountById', this.bankRedemptionData);
            });
          }
        });

        // if (this.accountData.userId) {

        // }
      }
      this.spinner.hide('global');
    });

    // this.getDataById();
  }


}
