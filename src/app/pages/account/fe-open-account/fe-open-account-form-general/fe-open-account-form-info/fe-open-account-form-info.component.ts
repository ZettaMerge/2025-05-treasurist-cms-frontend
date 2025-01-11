import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {AgentService, DropdownService} from '@api';
import {OpenAccountDTO} from '@model';

@Component({
  selector: 'fe-open-account-form-info',
  templateUrl: './fe-open-account-form-info.component.html',
  styleUrls: ['./fe-open-account-form-info.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FeOpenAccountFormInfoComponent implements OnInit, OnChanges {

  @Input() data;

  title: any;
  nationality: any;
  idType: any;
  maritalStatus: any;
  openAccountType: any;
  accountVerifyType: any;

  isTitleOther = false;
  isMarried = false;
  icLicense: any;
  teamName: any;

  listsStatus = [
    {id: 1, name: 'โสด', value: 'Single'},
    {id: 2, name: 'สมรส', value: 'Married'},
    // {id: 3, name: 'หย่า', value: 'Divorce'},
    // {id: 4, name: 'อื่นๆ', value: 'Other'},
  ];
  openAccountLists = [{id: 1, name: 'Single form', value: 'SINGLE_FORM'}];
  verifyIdentityLists = [{id: 1, name: 'NDID', value: 'NDID'}];
  listsIdType = [
    {id: 1, name: 'บัตรประชาชน', value: 'CITIZEN_CARD'},
    {id: 2, name: 'Passport', value: 'PASSPORT_NO'},
  ];

  listsPrefix = [
    {id: 1, name: 'นางสาว', value: 'MISS'},
    {id: 2, name: 'นาง', value: 'MRS'},
    {id: 3, name: 'นาย', value: 'MR'},
    {id: 4, name: 'อื่นๆ', value: 'OTHER'},
  ];

  constructor(
    protected dropdownService: DropdownService,
    protected agentService: AgentService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {

    // คำนำหน้าชื่อ
    if (this.data.title) {
      if (this.data.title === 'MISS') {
        this.title = {id: 1, name: 'นางสาว', value: 'MISS'};
      } else if (this.data.title === 'MRS') {
        this.title = {id: 2, name: 'นาง', value: 'MRS'};
      } else if (this.data.title === 'MR') {
        this.title = {id: 3, name: 'นาย', value: 'MR'};
      } else {
        this.title = {id: 4, name: 'อื่นๆ', value: 'OTHER'};
        this.isTitleOther = true;
      }
      console.log('thitle', this.data.title);

    }

    console.log('this.data.icLicense', this.data.icLicense);

    if (this.data.icLicense) {
      this.agentService.agentIcLicenseWithTeamDropdownGet$().subscribe( data => {
        const icLicense = data.find( ic => ic.icLicense === this.data?.icLicense);
        this.icLicense = icLicense;
        this.teamName = this.data?.teamName;
        console.log('icLicense', icLicense);
      });
      // this.dropdownService.dropdownNationalityGet$().subscribe(data => {
      //   const findNation = data.find(n => n.id === 415);
      //   this.nationality = findNation.name;
      //   this.data.nationality = findNation.value;
      // });
    }

    // Id Type
    if (this.data.identificationCardType) {
      if (this.data.identificationCardType === 'CITIZEN_CARD') {
        this.idType = {id: 1, name: 'บัตรประชาชน', value: 'CITIZEN_CARD'};
      } else {
        this.idType = {id: 2, name: 'Passport', value: 'PASSPORT_NO'};
      }
    }

    // สถานภาพ
    if (this.data.maritalStatus) {
      if (this.data.maritalStatus === 'Single') {
        this.maritalStatus = {id: 1, name: 'โสด', value: 'Single'};

      } else if (this.data.maritalStatus === 'Married') {
        this.maritalStatus = {id: 2, name: 'สมรส', value: 'Married'};
        this.isMarried = true;
      }
    }

    // วิธีการเปิดบัญชี
    if (this.data.openAccountType) {
      if (this.data.openAccountType === 'SINGLE_FORM') {
        this.openAccountType = {id: 1, name: 'Single form', value: 'SINGLE_FORM'};
      }
    }

    // วิธีการยืนยันตัวตน
    if (this.data.accountVerifyType) {
      if (this.data.accountVerifyType === 'NDID') {
        this.accountVerifyType = {id: 1, name: 'NDID', value: 'NDID'};
      }
    }
  }

  ngOnInit(): void {
    this.setNationalityDefault();
  }

  onChangDate(event) {
    console.log('onChangDate', event);
  }

  onLicenseChange(event){

    if (event) {
      this.data.icLicense = event?.icLicense;
      this.teamName = event?.teamName;
    } else {
      this.teamName = null;
    }
    console.log('license', event);
  }

  setNationalityDefault() {

    this.dropdownService.dropdownNationalityGet$().subscribe(data => {
      const findNation = data.find(n => n.id === 415);
      this.nationality = findNation.name;
      this.data.nationality = findNation.value;
    });

  }

  titleChange(event) {
    this.isTitleOther = false;
    if (event) {
      if (event.value !== 'OTHER') {
        console.log('hello ti', event);
        this.data.title = event.value;
        this.data.titleOther = null;
        this.isTitleOther = false;
      } else {
        this.data.title = event.value;
        this.isTitleOther = true;
      }
    }
  }


  onChangeIdType(event) {
    if (event) {
      console.log('hello ti', event);
      this.data.identificationCardType = event.value;
    }
  }

  onChangeNationality(event) {
    if (event) {
      console.log('hello ti', event);
      this.data.nationality = event.value;
    }
  }

  maritalStatusChange(event) {
    this.isMarried = false;
    if (event) {
      if (event.value !== 'Married') {
        console.log('hello ti', event);
        this.data.maritalStatus = event.value;
        this.isMarried = false;
      } else {
        this.data.maritalStatus = event.value;
        this.isMarried = true;
      }

    }
  }

  openAccountTypeChange(event) {
    if (event) {
      console.log('hello ti', event);
      this.data.openAccountType = event.value;
    }
  }

  accountVerifyTypeChange(event) {
    if (event) {
      console.log('hello ti', event);
      this.data.accountVerifyType = event.value;
    }
  }
}
