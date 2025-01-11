import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@api';
import { OrderTransactionListDTO } from '@model';
import { PopupService } from '@postnerd-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fe-valnerable-transaction-detail',
  templateUrl: './fe-valnerable-transaction-detail.component.html',
  styleUrls: ['./fe-valnerable-transaction-detail.component.scss']
})
export class FeValnerableTransactionDetailComponent implements OnInit {
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
    private popupService: PopupService,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.saOrderNoView = this.route.snapshot.paramMap.get('id');
    if (this.saOrderNoView) {
      this.getDataDetail();
      this.type = this.saOrderNoView.slice(0, 3);
    }
  }

  goBack() {
    this.router.navigate([`./order/vulnerable-transaction`]);
  }

  getDataDetail() {
    this.spinner.show('global');
    this.dataSub = this.orderService.orderTransactionIdGet$(this.saOrderNoView).subscribe(data => {
      console.log('orderTransactionIdGet', data);
      this.subscriptionData = data.subscription;
      this.redemptionData = data.redemption;
      this.spinner.hide('global');

    });
  }

  onApprove() {
    // console.log('onApprove', this.saOrderNoView);
    this.popupService.confirm(`ยืนยันข้อมูล`, `ท่านต้องการ Approve รายการนี้ใช่หรือไม่?`, `primary`)
      .subscribe((res) => {
        if (res) {
          this.spinner.show('global');
          this.orderService.orderTransactionVulnerableApprovePatch$(this.saOrderNoView).subscribe(() => {
            this.toastrService.success('Approve success.');
            this.spinner.hide('global');
            this.getDataDetail();
          });
        }
      },
        error => {
          this.toastrService.error(`${error.error.errorMessage}`);
          this.spinner.hide('global');
        }
      );
  }
}
