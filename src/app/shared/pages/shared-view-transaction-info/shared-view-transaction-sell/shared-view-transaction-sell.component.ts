import { Component, Input, OnInit } from '@angular/core';
import { OrderTransactionListDTO } from '@model';

@Component({
  selector: 'shared-view-transaction-sell',
  templateUrl: './shared-view-transaction-sell.component.html',
  styleUrls: ['./shared-view-transaction-sell.component.scss']
})
export class SharedViewTransactionSellComponent implements OnInit {
  @Input() redemptionData: OrderTransactionListDTO;
  constructor() { }

  ngOnInit(): void {
  }

}
