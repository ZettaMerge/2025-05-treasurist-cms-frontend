import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OrderTransactionListDTO } from '@model';

@Component({
  selector: 'shared-view-transaction-buy',
  templateUrl: './shared-view-transaction-buy.component.html',
  styleUrls: ['./shared-view-transaction-buy.component.scss']
})
export class SharedViewTransactionBuyComponent implements OnInit, OnChanges {
  @Input() subscriptionData: OrderTransactionListDTO;
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('subscriptionData', this.subscriptionData);
  }
}
