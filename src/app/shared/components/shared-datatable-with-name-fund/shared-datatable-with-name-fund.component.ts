import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-datatable-with-name-fund',
  templateUrl: './shared-datatable-with-name-fund.component.html',
  styleUrls: ['./shared-datatable-with-name-fund.component.scss']
})
export class SharedDatatableWithNameFundComponent implements OnInit {

  @Input() fundCode: string;
  @Input() riskLevel: string;
  @Input() fundName: string;
  constructor() { }

  ngOnInit(): void {
  }

}
