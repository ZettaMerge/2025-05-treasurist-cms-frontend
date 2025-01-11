import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OrderTransactionListDTO } from '@model';

@Component({
  selector: 'shared-view-transaction-info',
  templateUrl: './shared-view-transaction-info.component.html',
  styleUrls: ['./shared-view-transaction-info.component.scss']
})
export class SharedViewTransactionInfoComponent implements OnInit, OnChanges {
  @Input() subscriptionData: OrderTransactionListDTO;
  @Input() redemptionData: OrderTransactionListDTO;
  @Input() type;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('type', this.type);
  }
}
