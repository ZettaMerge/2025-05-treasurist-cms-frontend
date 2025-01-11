import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseFeatureTabComponent, ModalComponent } from '@postnerd-core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerListDTO, CustomerProfileDTO, OpenAccountDTO } from '@model';
import { AccountService, CustomerService } from '@api';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


enum Tab {
  portFolio = 1,
  profile = 2,
}

@Component({
  selector: 'fe-customer-profile',
  templateUrl: './fe-customer-profile.component.html',
  styleUrls: ['./fe-customer-profile.component.scss']
})
export class FeCustomerProfileComponent extends BaseFeatureTabComponent implements OnInit {

  @ViewChild('modal') modal: ModalComponent;

  customerId: string;
  customerData: CustomerProfileDTO = {} as CustomerProfileDTO;
  accountData: OpenAccountDTO = {} as OpenAccountDTO;
  Tab = Tab;
  legalEntity = false;
  dataSub: Subscription;

  profileData: any;

  planAccount: any;
  planAccountList = [];

  tabs = [
    { name: 'Portfolio', id: Tab.portFolio },
    { name: 'Profile', id: Tab.profile },
  ];
  fileData = [
    { fileName: 'Application Form' },
    { fileName: 'ID Card/Passport/Juristic Document' },
    { fileName: 'Suitability Form' },
    { fileName: 'FATCA Form' },
  ];

  crountryList = [
    { id: 1, name: 'ไทย' },
    { id: 1, name: 'ไทย' },
  ];

  incomeList = [
    { id: 1, name: 'เงินเดือน' },
    { id: 2, name: 'เงินออม' },
    { id: 3, name: 'ธุรกิต' },
    { id: 4, name: 'มรดก' },
    { id: 5, name: 'ลงทุน' },
    { id: 6, name: 'เงินเกษียน' },
    { id: 7, name: 'อื่นๆ' },
  ];


  constructor(
    protected route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
  ) {
    super(route);
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.getCustomerProfileById();
  }

  goBack() {
    this.router.navigate([`./customer/list`]);
  }

  getCustomerProfileById() {

    // this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
    this.dataSub = this.customerService.customerIdGet$(_.toNumber(this.customerId)).subscribe(data => {
      this.customerData = data;

      console.log('customer DAta', this.customerData);

      if (this.customerData) {
        this.getBank();
      }

      if (this.customerData.fcnAccountIds) {

        this.planAccount = _.map(this.customerData.fcnAccountIds, (item) => ({
          name: item
        }));
        // this.fcnAccount = fcnAccountIds;
        // const splitData = JSON.parse(this.customerData.fcnAccountIds);
      }
      this.getTabs();
      // this.spinner.hide('global');
    });
  }

  getTabs() {
    for (const tab of this.planAccount) {
      const findLastIndex = _.last(this.tabs);
      this.tabs.push({ name: tab.name, id: findLastIndex.id + 1 });
      this.planAccountList.push({ name: tab.name, id: findLastIndex.id + 1 });
    }

    this.planAccountList = _.uniqBy(this.planAccountList, 'name');
    this.tabs = _.uniqBy(this.tabs, 'name');

  }

  getBank() {
    this.customerService.customerIdInfoGet$(this.customerData.id).subscribe(data => {
      console.log('accountId', data);
      if (data.accountId) {
        this.accountService.openAccountDetailIdGet$(data.accountId).subscribe(accData => {
          console.log('acc Data', accData);
          this.accountData = accData;
        });
      }
      this.spinner.hide('global');
    });
  }

  convertBankName(bankName) {
    const convertBankName = bankName;
    const name = convertBankName ? convertBankName.split('ธนาคาร') : '-';
    return name !== '-' ? name[1] : name;
  }

  convertBranchName(branchName) {
    const convertBranchName = branchName;
    const name = convertBranchName && convertBranchName !== 'ไม่ระบุสาขา' ? convertBranchName.split('สาขา') : 'ไม่ระบุสาขา';
    console.log('name', name[1]);
    return name !== 'ไม่ระบุสาขา' ? name[1] : name;
  }

  onSyncAccount() {
    this.modal.open();

  }

  getProfileId(event) {
    console.log('event profile id')
    this.profileData = event;
  }

  onGetDataSync(event) {
    console.log('...get account sync', event);

    this.getCustomerProfileById();
    this.modal.close();


  }

}
