import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {OpenAccountDTO} from '@model';
import * as _ from 'lodash';
import {DropdownService} from '@api';

@Component({
  selector: 'fe-open-account-form-source-income',
  templateUrl: './fe-open-account-form-source-income.component.html',
  styleUrls: ['./fe-open-account-form-source-income.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FeOpenAccountFormSourceIncomeComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() isValidIncomeSourceCountry;
  @Input() isValidIncomeSource;
  @Input() isValidInvestMent;

  // ประเทศของแหล่งที่มารายได้
  isCountry = false;
  isOtherCountry = false;
  otherCountry: any;
  monthlyIncomeLevel: any;

  lists = [
    {id: 1, name: '1000'},
    {id: 2, name: '10000'},
    {id: 3, name: '100000'},
  ];

  // ที่มาของรายได้
  sourceIncomeData = [
    {id: 1, name: 'เงินเดือน', isAllow: false, value: 'SALARY'},
    {id: 2, name: 'เงินออม', isAllow: false, value: 'SAVINGS'},
    {id: 3, name: 'เงินเกษียณ', isAllow: false, value: 'RETIREMENT'},
    {id: 4, name: 'มรดก', isAllow: false, value: 'HERITAGE'},
    {id: 5, name: 'เงินลงทุน', isAllow: false, value: 'INVESTMENT'},
    {id: 6, name: 'ประกอบธุรกิจ', isAllow: false, value: 'BUSINESS'},
    {id: 7, name: 'อื่นๆ', isAllow: false, value: 'OTHER'},
  ];

  // วัตถุประส่งในการลงทุน
  objInvestData = [
    {id: 1, name: 'เพื่อการลงทุน', isAllow: false, value: 'Investment'},
    {id: 2, name: 'เพื่อการเกษียณ', isAllow: false, value: 'RetirementInvestment'},
    {id: 3, name: 'ลดหย่อนภาษี', isAllow: false, value: 'ForTaxBenefits'},
    {id: 4, name: 'อื่นๆ', isAllow: false, value: 'PleaseSpecify'},
  ];


  constructor(
    protected dropdownService: DropdownService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {

   if (this.data.id) {
     // check ประเทศที่มาของรายได้
     if (this.data.incomeSourceCountry) {

       if (this.data.incomeSourceCountry === 'TH') {
         this.isCountry = true;
       } else if (this.data.incomeSourceCountry !== 'TH') {
         this.isOtherCountry = true;
         this.dropdownService.dropdownCountryGet$().subscribe(data => {
           const findCountry = data.find(occ => occ.value === this.data.incomeSourceCountry);
           this.otherCountry = findCountry;
         });
       }
       console.log('income country', this.data.incomeSourceCountry);
     }

     // check ที่มาของรายได้
     if (this.data.incomeSource) {
       console.log('income source', this.data.incomeSource);
       const convertJson = this.data.incomeSource.split(',');
       const incomeArray = [];
       convertJson.forEach(incomeSource => {
         incomeArray.push({value: incomeSource});
       });
       // check sourceIncome

       for (const income of incomeArray) {
         const incomeIndex = _.findIndex(this.sourceIncomeData, i => i.value === income.value);
         console.log('index iss', incomeIndex);
         if (incomeIndex >= 0) {
           this.sourceIncomeData[incomeIndex].isAllow = true;
         }

       }
       this.data.incomeSource = JSON.stringify(this.sourceIncomeData);
     }

     // check รายได้ต่อเดือน
     if (this.data.monthlyIncomeLevel) {
       console.log('income', this.data.monthlyIncomeLevel);
       this.dropdownService.dropdownMonthIncomeGet$().subscribe(data => {
         const findMonthIncome = data.find(income => income.value === this.data.monthlyIncomeLevel);
         this.monthlyIncomeLevel = findMonthIncome;
       });
     }

     // check วัตถุประสงค์ในการลงทุน
     if (this.data.investmentObjective) {
       console.log('inves obj', this.data.investmentObjective);
       const convertInvestJson = this.data.investmentObjective.split(',');
       const inVestArray = [];
       convertInvestJson.forEach(incomeSource => {
         inVestArray.push({value: incomeSource});
       });
       // check sourceIncome

       for (const invest of inVestArray) {
         const investIndex = _.findIndex(this.objInvestData, i => i.value === invest.value);
         console.log('index iss', investIndex);
         this.objInvestData[investIndex].isAllow = true;
       }

       this.data.investmentObjective = JSON.stringify(this.objInvestData);
     }
   }
  }

  ngOnInit(): void {
  }

  onChangeCountry(event, type) {
    this.isValidIncomeSourceCountry = false;
    if (event) {
      if (type === 'thaiCountry') {
        this.isOtherCountry = false;
        this.isCountry = event;
        this.data.incomeSourceCountry = 'TH';

      } else if (type === 'otherCountry') {
        this.isCountry = false;
        this.isOtherCountry = event;
      } else {
        this.data.incomeSourceCountry = null;
      }
    } else {
      this.isCountry = false;
      this.isOtherCountry = false;
      this.data.incomeSourceCountry = null;
    }
    console.log('income source country', this.data.incomeSourceCountry);
  }

  onChangeIncomeSource(event, index) {
    this.isValidIncomeSource = false;
    if (event) {
      this.sourceIncomeData[index].isAllow = event;
      this.data.incomeSource = JSON.stringify(this.sourceIncomeData);
    }
  }

  onChangeOtherCountry(event) {
    console.log('event', event);
    if (event) {
      this.data.incomeSourceCountry = event.value;
    }
    console.log('this.data.incomeSourceCountry', this.data.incomeSourceCountry);
  }

  onChangeMonthlyIncome(event) {
    console.log('event', event);
    if (event) {
      this.data.monthlyIncomeLevel = event.value;
    }
    console.log('this.data.incomeSourceCountry', this.data.incomeSourceCountry);
  }

  onChangeObjInvest(event, index) {
    this.isValidInvestMent = false;
    if (event) {
      this.objInvestData[index].isAllow = event;
      // const concatInvest = _.concat(this.objInvestData,);
      this.data.investmentObjective = JSON.stringify(this.objInvestData);

    }
  }

}
