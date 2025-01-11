import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface Unitholder {
  amc: string;
  unitholderID: number;
  type: string;
  status: string;
  acc: string;
  nameBank: string;
  branchBank: string;
  numberBank: string;
  accNo: number;
}
@Component({
  selector: 'fe-account-bank-account-detail',
  templateUrl: './fe-account-bank-account-detail.component.html',
  styleUrls: ['./fe-account-bank-account-detail.component.scss']
})
export class FeAccountBankAccountDetailComponent implements OnInit {

  statusFx = true;
  statusCommo = false;
  unitholderData: Unitholder[] = [
    {
      amc: 'KKPAM', unitholderID: 7206406001180, type: 'Segregete', status: 'ACTIVE', acc: 'Red',
      nameBank: 'SCB', branchBank: 'ไม่ระบุสาขา', numberBank: '00000', accNo: 113990954
    },
    {
      amc: 'KSAM', unitholderID: 9830100142, type: 'Segregete', status: 'ACTIVE', acc: 'Red',
      nameBank: 'SCB', branchBank: 'ไม่ระบุสาขา', numberBank: '00000', accNo: 113990954
    },
    {
      amc: 'KTAM', unitholderID: 66200000018, type: 'Segregete', status: 'ACTIVE', acc: 'Red',
      nameBank: 'SCB', branchBank: 'เซ็นทรัล ชิดลม', numberBank: '5092', accNo: 4680896118
    },
    {
      amc: 'ONEAM', unitholderID: 109000121000014, type: 'Segregete', status: 'ACTIVE', acc: 'Red',
      nameBank: 'SCB', branchBank: 'ไม่ระบุสาขา', numberBank: '00000', accNo: 4680896118
    },
  ];
  constructor(
    private router: Router,
    protected route: ActivatedRoute, ) { }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate([`./account/account-ats-approval`]);
  }
}
