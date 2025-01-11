import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {FundService} from '@api';
import {Subscription} from 'rxjs';
import {FundByIdDTO} from 'src/app/api/model/FundByIdDTO';
import * as _ from 'lodash';
import {RecurringSubscriptionsListDTO} from '@model';
import moment from 'moment';

interface RecurringSubscriptionListDTOCustom extends RecurringSubscriptionsListDTO {
  fund?: any;
  amcCode?: any;
  minimum?: any;
  cutOff?: any;
  isErrorMinimum?: any;
  isFundDouble?: any;
  isErrorNumber?: any;
  isErrorEffectiveDateStart?: any;
  isErrorEffectiveDateEnd?: any;


}

@Component({
  selector: 'fe-order-placement-form-dca',
  templateUrl: './fe-order-placement-form-dca.component.html',
  styleUrls: ['./fe-order-placement-form-dca.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FeOrderPlacementFormDcaComponent implements OnInit, OnChanges {
  @Input() type;
  @Input() fcnAccountId;
  @Input() customerId;
  @Output() dcaFundData = new EventEmitter();
  @Input() fundPlansId;

  fundData: FundByIdDTO = {} as FundByIdDTO;
  fundId: number;
  dcaFundArray: RecurringSubscriptionListDTOCustom[];
  debitType = 1;
  dateEnd = 1;
  selectDate: any;
  effectiveDateStart: any;
  effectiveDateEnd: any;
  currentDate = moment().format('YYYY-MM-DD');
  isErrorEffectiveDateStart = false;
  isErrorEffectiveDateEnd = false;
  listsDateDropdown = [
    {id: 1, name: 'ทุกวันที่ 1'},
    {id: 2, name: 'ทุกวันที่ 2'},
    {id: 3, name: 'ทุกวันที่ 3'},
    {id: 4, name: 'ทุกวันที่ 4'},
    {id: 5, name: 'ทุกวันที่ 5'},
    {id: 6, name: 'ทุกวันที่ 6'},
    {id: 7, name: 'ทุกวันที่ 7'},
    {id: 8, name: 'ทุกวันที่ 8'},
    {id: 9, name: 'ทุกวันที่ 9'},
    {id: 10, name: 'ทุกวันที่ 10'},
    {id: 11, name: 'ทุกวันที่ 11'},
    {id: 12, name: 'ทุกวันที่ 12'},
    {id: 13, name: 'ทุกวันที่ 13'},
    {id: 14, name: 'ทุกวันที่ 14'},
    {id: 15, name: 'ทุกวันที่ 15'},
    {id: 16, name: 'ทุกวันที่ 16'},
    {id: 17, name: 'ทุกวันที่ 17'},
    {id: 18, name: 'ทุกวันที่ 18'},
    {id: 19, name: 'ทุกวันที่ 19'},
    {id: 20, name: 'ทุกวันที่ 20'},
    {id: 21, name: 'ทุกวันที่ 21'},
    {id: 22, name: 'ทุกวันที่ 22'},
    {id: 23, name: 'ทุกวันที่ 23'},
    {id: 24, name: 'ทุกวันที่ 24'},
    {id: 25, name: 'ทุกวันที่ 25'},
    {id: 26, name: 'ทุกวันที่ 26'},
    {id: 27, name: 'ทุกวันที่ 27'},
    {id: 28, name: 'ทุกวันที่ 28'},
    {id: 29, name: 'ทุกวันที่ 29'},
    {id: 30, name: 'ทุกวันที่ 30'},
    {id: 31, name: 'ทุกวันที่ 31'},
  ];

  listsWeekDropdown = [
    {id: 1, name: 'วันจันทร์', value: '0'},
    {id: 2, name: 'วันอังคาร', value: '1'},
    {id: 3, name: 'วันพุธ', value: '2'},
    {id: 4, name: 'วันพฤหัสบดี', value: '3'},
    {id: 5, name: 'วันศุกร์', value: '4'},
  ];

  debitTypeList = [
    {value: 1, label: 'รายสัปดาห์'},
    {value: 0, label: 'รายเดือน'}
  ];

  dateEndList = [
    {value: 1, label: 'ไม่กำหนด'},
    {value: 0, label: 'กำหนดเอง'}
  ];

  dataSub: Subscription;

  constructor(private fundService: FundService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type) {
      this.dcaFundArray = [{
        amount: undefined,
        channel: 'MOB',
        effectiveDateFrom: undefined,
        effectiveDateTo: undefined,
        frequency: undefined,
        fundCode: undefined,
        paymentType: 'ATS_SA',
        selectDate: undefined,
        selectDay: undefined,
        fund: undefined,
        amcCode: undefined,
        minimum: undefined,
        cutOff: undefined,
        isErrorMinimum: false,
        isFundDouble: false,
        isErrorNumber: false,
        isErrorEffectiveDateStart: false,
        isErrorEffectiveDateEnd: false,
      }];
    }
  }

  onChangeTransactionDate() {

    this.dcaFundArray.forEach((dca) => {
      dca.frequency = this.debitType === 1 ? 'WEEKLY' : 'MONTHLY';
      dca.selectDay = this.debitType === 1 ? this.selectDate?.value : undefined;
      dca.selectDate = this.debitType === 0 ? this.selectDate?.id : undefined;
    });
    this.dcaFundData.emit(this.dcaFundArray);
  }

  onChangeEffectiveDateStart() {

    const effectiveDateStart = moment(this.effectiveDateStart).format('YYYY-MM-DD');
    console.log('effectiveDateStart', effectiveDateStart);
    console.log('currentDate', this.currentDate);
    const isBeforeData = moment(this.currentDate).isBefore(effectiveDateStart);
    console.log('isBeforeData', isBeforeData);
    if (isBeforeData) {
      this.isErrorEffectiveDateStart = false;
    } else {
      this.isErrorEffectiveDateStart = true;
    }
    this.dcaFundArray.forEach((dca) => {
      dca.effectiveDateFrom = moment(this.effectiveDateStart).format('DD/MM/YYYY');
      if (isBeforeData) {
        dca.isErrorEffectiveDateStart = false;
      } else {
        dca.isErrorEffectiveDateStart = true;
      }
    });
    this.dcaFundData.emit(this.dcaFundArray);
  }

  onChangeEffectiveDateEnd() {
    const effectiveDateStart = moment(this.effectiveDateStart).format('YYYY-MM-DD');
    const effectiveDateEnd = moment(this.effectiveDateEnd).format('YYYY-MM-DD');
    console.log('effectiveDateStart', effectiveDateStart);
    console.log('effectiveDateEnd', effectiveDateEnd);
    const isBeforeData = moment(effectiveDateStart).isBefore(effectiveDateEnd);
    console.log('isBeforeData', isBeforeData);
    if (isBeforeData) {
      this.isErrorEffectiveDateEnd = false;
    } else {
      this.isErrorEffectiveDateEnd = true;
    }
    this.dcaFundArray.forEach((dca) => {
      dca.effectiveDateTo = moment(this.effectiveDateEnd).format('DD/MM/YYYY');
      if (isBeforeData) {
        dca.isErrorEffectiveDateEnd = false;
      } else {
        dca.isErrorEffectiveDateEnd = true;
      }
    });
    this.dcaFundData.emit(this.dcaFundArray);
  }

  onEffectiveDateEnd() {
    if (this.dateEnd === 0) {
      return true;
    } else {
      return false;
    }
  }

  addFund(event) {
    this.dcaFundArray.push({
      amount: undefined,
      channel: 'MOB',
      effectiveDateFrom: undefined,
      effectiveDateTo: undefined,
      frequency: undefined,
      fundCode: undefined,
      paymentType: 'ATS_SA',
      selectDate: undefined,
      selectDay: undefined,
      fund: undefined,
      amcCode: undefined,
      minimum: undefined,
      cutOff: undefined,
      isErrorMinimum: false,
      isFundDouble: false,
      isErrorEffectiveDateStart: false,
      isErrorEffectiveDateEnd: false,
    });
  }


  deleteFund(index) {
    if (this.dcaFundArray.length > 1) {
      this.dcaFundArray.splice(index, 1);
    }
  }

  fundAmountChange(event, amount, minimum, i) {
    console.log('fundAmountChange', event);
    console.log('fundAmountChange amount', amount);
    if (_.toNumber(amount) < minimum) {
      this.dcaFundArray[i].isErrorMinimum = true;
    } else {
      this.dcaFundArray[i].isErrorMinimum = false;
    }
    this.dcaFundData.emit(this.dcaFundArray);
  }

  onBlurEvent(i, fund) {
    this.dcaFundArray[i].amount = fund.amount + '.00';
    this.dcaFundData.emit(this.dcaFundArray);
  }

  onFocusAmount(index) {
    if (this.dcaFundArray[index].amount) {
      this.dcaFundArray[index].amount = _.toNumber(this.dcaFundArray[index].amount);
    } else {
      this.dcaFundArray[index].amount = null;
    }
  }

  onAssetChange(event, index) {
    console.log('onAssetChange', event);
    this.dcaFundArray[index].fund = undefined;
    this.dcaFundArray[index].amount = undefined;
    this.dcaFundArray[index].isErrorMinimum = false;
    if (_.isNaN(this.dcaFundArray[index].amount)) {
      this.dcaFundArray[index].amount = undefined;
    }
    this.dcaFundData.emit(this.dcaFundArray);
  }

  onFundChange(event, index) {
    // console.log('onFundChange', event);
    if (event) {
      this.fundId = event ? event.id : undefined;
      this.dcaFundArray[index].fundCode = event.fundCode;
      this.dcaFundArray[index].amcCode = event.amcCode;
      this.dcaFundArray[index].amount = undefined;
      this.dcaFundArray[index].isErrorMinimum = false;
      const findFundDouble = _.filter(this.dcaFundArray, b => b.fundCode === event?.fundCode);
      // console.log('findFundDouble', findFundDouble);
      if (findFundDouble.length > 1) {
        this.dcaFundArray[index].isFundDouble = true;
      } else {
        this.dcaFundArray[index].isFundDouble = false;
      }
    } else {
      this.dcaFundArray[index].amcCode = undefined;
    }

    this.getFundById(index);

  }


  getFundById(index) {

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.fundService.fundByIdGet$(this.fundId, this.fundPlansId).subscribe(data => {
      // console.log('dataa fundd', data);
      this.fundData = data;
      // this.dcaFundArray[index].cutOff = this.fundData.buyCutOffTime;
      this.dcaFundArray[index].minimum = this.fundData.unitholderId ? this.fundData.nxtLowBuy : this.fundData.fstLowBuy;

      this.dcaFundData.emit(this.dcaFundArray);
    });
  }
}
