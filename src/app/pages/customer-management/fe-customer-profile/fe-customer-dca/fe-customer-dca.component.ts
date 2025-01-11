import {Component, OnInit, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {BaseFeatureGridComponent} from '@postnerd-core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import { RecurringService } from '@api';
import { RecurringDetailDTO } from '@model';

@Component({
  selector: 'fe-customer-dca',
  templateUrl: './fe-customer-dca.component.html',
  styleUrls: ['./fe-customer-dca.component.scss']
})
export class FeCustomerDcaComponent extends BaseFeatureGridComponent<RecurringDetailDTO, any> implements OnInit, OnDestroy {

  @ViewChild('fundTpl', {static: true}) fundTpl: TemplateRef<any>;
  @ViewChild('dcaTypeTpl', {static: true}) dcaTypeTpl: TemplateRef<any>;
  @ViewChild('selectDateTpl', {static: true}) selectDateTpl: TemplateRef<any>;

  dataSub: Subscription;
  fcnAccountId: string;
  sortData = 'paymentDate';
  direction = 'desc';

  constructor(
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private recurringService: RecurringService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fcnAccountId = this.route.snapshot.paramMap.get('fcnAccountId');
    if (this.fcnAccountId) {
      this.sort = { prop: 'fundCode', sortBy : 'fundCode' , asc: false };
      // this.sort = { prop: 'selectDate', sortBy : 'selectDate' , asc: false };
      super.ngOnInit();
      this.getData();

    }
  }


  protected setColumns() {
    this.columns = [
      {
        name: 'กองทุน',
        prop: 'fundCode',
        sortable: true,
        cellTemplate: this.fundTpl
      },
      {
        name: 'บลจ.',
        prop: 'amcCode',
        sortable: true,
      },
      {
        name: 'รูปแบบ DCA',
        prop: 'frequency',
        sortable: true,
        cellTemplate: this.dcaTypeTpl,
      },
      {
        name: 'วันที่ทำรายการ',
        prop: 'selectDate',
        sortable: true,
        cellTemplate: this.selectDateTpl,
        // sortBy: 'selectDay',
      },
      {
        name: 'จำนวนเงิน',
        prop: 'amount',
        cellTemplate: this.grid.decimalTpl,
        sortable: true,
      }
    ];
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.recurringService.recurringListGet$(
      this.fcnAccountId,
      undefined,
      undefined,
      undefined,
    ).subscribe( data => {
      this.rows = data;
      this.page.totalCount = this.rows.length;
      this.page.perPage = this.rows.length;
      this.spinner.hide('global');
    });
    // recurringListGet$
  }

  displayWeeklyDate(date) {
    if (date) {
      const weeklyDate = date === 'MON' ? 'จันทร์' : date === 'TUE' ? 'อังคาร' : date === 'WED' ? 'พุธ' : date === 'THU' ? 'พฤหัส' : date === 'FRI' ? 'ศุกร์' : '-';
      return `ทุกวัน${weeklyDate}`;
    }
  }

  displayMonthlyDate(date) {
    if (date) {
      return `ทุกวันที่ ${date}`;
    }
  }

}
