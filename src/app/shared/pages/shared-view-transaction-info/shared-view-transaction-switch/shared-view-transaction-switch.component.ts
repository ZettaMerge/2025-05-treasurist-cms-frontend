import { Component, Input, OnInit } from '@angular/core';
import { OrderTransactionListDTO } from '@model';

@Component({
  selector: 'shared-view-transaction-switch',
  templateUrl: './shared-view-transaction-switch.component.html',
  styleUrls: ['./shared-view-transaction-switch.component.scss']
})
export class SharedViewTransactionSwitchComponent implements OnInit {
  @Input() subscriptionData: OrderTransactionListDTO;
  @Input() redemptionData: OrderTransactionListDTO;
  @Input() type;
  constructor() { }

  ngOnInit(): void {
    console.log('type', this.type);
  }

}
