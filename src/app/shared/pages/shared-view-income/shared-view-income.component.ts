import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DropdownService } from "@api";
import * as _ from 'lodash';
@Component({
  selector: 'shared-view-income',
  templateUrl: './shared-view-income.component.html',
  styleUrls: ['./shared-view-income.component.scss']
})
export class SharedViewIncomeComponent implements OnInit, OnChanges {
  @Input() data: any;
  // ที่มาของรายได้
  incomeSourceData = [];
  inVestData = [];
  monthlyIncomeLevel: string;

  // วัตถุประสงค์ในการลงทุน
  invests = [
    { name: 'เพื่อการลงทุน' },
    { name: 'เพื่อการเกษียณ' },
    { name: 'ลดหย่อนภาษี' },
  ];

  constructor(
    protected dropdownService: DropdownService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {

    if (this.data.incomeSource) {
      console.log('this.data.incomeSource', this.data.incomeSource);
      const convertJson = this.data.incomeSource.split(',');

      convertJson.forEach(incomeSource => {

        this.incomeSourceData.push({ name: incomeSource });
      });

      this.incomeSourceData = _.uniqBy(this.incomeSourceData, 'name')


    }

    // เงินเดือน
    if (this.data.monthlyIncomeLevel) {
      this.dropdownService.dropdownMonthIncomeGet$().subscribe(data => {
        const findMonthIncome = data.find(income => income.value === this.data.monthlyIncomeLevel);
        this.monthlyIncomeLevel = findMonthIncome.name;
      });
    }

    // check วัตถุประสงค์ในการลงทุน
    if (this.data.investmentObjective) {
      console.log('inves obj', this.data.investmentObjective);
      const convertInvestJson = this.data.investmentObjective.split(',');
      convertInvestJson.forEach(incomeSource => {
        this.inVestData.push({ name: incomeSource });
      });
      this.inVestData = _.uniqBy(this.inVestData, 'name')
    }
  }

  ngOnInit(): void {
  }

}
