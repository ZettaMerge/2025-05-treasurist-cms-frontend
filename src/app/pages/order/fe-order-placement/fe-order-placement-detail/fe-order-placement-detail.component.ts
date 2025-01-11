import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@api';
import { OrderTransactionListDTO } from '@model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fe-order-placement-detail',
  templateUrl: './fe-order-placement-detail.component.html',
  styleUrls: ['./fe-order-placement-detail.component.scss']
})
export class FeOrderPlacementDetailComponent implements OnInit {

  @Input() orderPlacementData;
  @Input() isNew;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  subscriptionData: OrderTransactionListDTO;
  redemptionData: OrderTransactionListDTO;
  saOrderNoView: string;
  type: string;

  dataSub: Subscription;
  constructor(
    protected route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private spinner: NgxSpinnerService, ) { }

  ngOnInit(): void {
    this.saOrderNoView = this.route.snapshot.paramMap.get('id');
    if (this.saOrderNoView) {
      this.getDataDetail();
      this.type = this.saOrderNoView.slice(0, 3);
    }
  }


  goBack() {
    this.router.navigate([`./order/order-placement`]);
  }


  onCancel() {
    this.cancel.emit();
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
