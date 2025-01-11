import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@api';
import { OrderTransactionListDTO } from '@model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fe-transaction-detail',
  templateUrl: './fe-transaction-detail.component.html',
  styleUrls: ['./fe-transaction-detail.component.scss']
})
export class FeTransactionDetailComponent implements OnInit {

  saOrderNoView: string;
  type: string;
  subscriptionData: OrderTransactionListDTO;
  redemptionData: OrderTransactionListDTO;

  dataSub: Subscription;
  constructor(
    protected route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.saOrderNoView = this.route.snapshot.paramMap.get('id');
    if (this.saOrderNoView) {
      this.getDataDetail();
      this.type = this.saOrderNoView.slice(0, 3);
    }
  }

  goBack() {
    this.router.navigate([`./order/transaction`]);
  }

  getDataDetail() {
    this.spinner.show('global');
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.orderService.orderTransactionIdGet$(this.saOrderNoView).subscribe(data => {
      console.log('orderTransactionIdGet', data);
      this.subscriptionData = data.subscription;
      this.redemptionData = data.redemption;
      this.spinner.hide('global');

    });
  }
}
