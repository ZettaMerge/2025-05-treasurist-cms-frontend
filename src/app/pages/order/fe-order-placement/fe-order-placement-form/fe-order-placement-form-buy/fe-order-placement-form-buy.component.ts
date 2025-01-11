import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { FundService } from '@api';
import { Subscription } from 'rxjs';
import { FundByIdDTO } from 'src/app/api/model/FundByIdDTO';
import * as moment from 'moment';
import * as _ from 'lodash';
import { debounce } from 'lodash';
import { SubscriptionListDTO } from '@model';

interface SubscriptionListDTOCustom extends SubscriptionListDTO {
  fund?: any;
  amcCode?: any;
  minimum?: any;
  cutOff?: any;
  isErrorMinimum?: any;
  isFundDouble?: any;
  disabledDates?: any[];
  minDate?: any;
  datesEnabled?: any[];

}
@Component({
  selector: 'fe-order-placement-form-buy',
  templateUrl: './fe-order-placement-form-buy.component.html',
  styleUrls: ['./fe-order-placement-form-buy.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FeOrderPlacementFormBuyComponent implements OnInit, OnChanges {
  @Input() type;
  @Input() fcnAccountId;
  @Input() fundPlansId;
  @Input() customerId;
  @Input() acceptVulnerableFlag;
  @Output() byFundData = new EventEmitter();
  byFundArray: SubscriptionListDTOCustom[];
  fundId: number;
  dataSub: Subscription;
  fundData: FundByIdDTO = {} as FundByIdDTO;
  cutOffTime = [];
  disabledDates = [];
  datesEnabled = [];
  maxDate = moment().add(3, 'month').toDate();
  minDate = moment().toDate();
  lists = [
    { id: 1, name: 'บาท' },
    { id: 2, name: 'หน่วย' },
  ];

  constructor(
    private fundService: FundService) {
  }



  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('acceptVulnerableFlag', this.acceptVulnerableFlag);
    if (changes.fcnAccountId || changes.type || changes.customerId) {
      this.byFundArray = [
        {
          amount: null,
          channel: 'MOB',
          effectiveDate: undefined,
          forceEntry: 'Y',
          fundCode: undefined,
          paymentType: undefined,
          redemptionType: 'AMT',
          // unitholderId: undefined,
          fund: undefined,
          amcCode: undefined,
          minimum: undefined,
          cutOff: undefined,
          isErrorMinimum: false,
          isFundDouble: false,
          disabledDates: [],
          minDate: undefined,
          datesEnabled: [],

        }
      ];
      console.log('byFundArray', this.byFundArray);
    }
  }

  onChangeDate(index, byFundData) {
    console.log('onChangeDate', this.byFundArray);
    // this.byFundArray[index].amount = parseFloat(byFundData.amount).toFixed(2);
    this.byFundData.emit(this.byFundArray);
  }



  deleteFund(index) {

    if (this.byFundArray.length > 1) {
      // this.isAddDisable = false;
      this.byFundArray.splice(index, 1);
    }
    this.byFundData.emit(this.byFundArray);
  }

  addFund(event) {

    this.byFundArray.push({
      amount: null,
      channel: 'MOB',
      effectiveDate: undefined,
      forceEntry: 'Y',
      fundCode: undefined,
      paymentType: undefined,
      redemptionType: 'AMT',
      // unitholderId: undefined,
      fund: undefined,
      amcCode: undefined,
      minimum: undefined,
      cutOff: undefined,
      isErrorMinimum: false,
      isFundDouble: false,
      disabledDates: [],
      minDate: undefined,
      datesEnabled: [],
    });

  }

  fundAmountChange(event, amount, minimum, index) {
    console.log('fundAmountChange', _.toNumber(event));
    if (event  && _.toNumber(event) < minimum) {
      this.byFundArray[index].isErrorMinimum = true;
    } else {
      // this.byFundArray[index].amount = parseFloat(event).toFixed(2);
      this.byFundArray[index].isErrorMinimum = false;
    }
  }

  onFocusAmount(index) {
    if (this.byFundArray[index].amount) {
      this.byFundArray[index].amount = _.toNumber(this.byFundArray[index].amount);
    } else {
      this.byFundArray[index].amount = null;
    }
  }

  onBlurEvent(event, index, amount) {
    // this.byFundArray[index].amount = parseFloat(byFundData.amount).toFixed(2);
    this.byFundArray[index].amount = !amount ? amount : amount + '.00';
    this.byFundData.emit(this.byFundArray);

    // console.log('onBlurAmountEvent', amount);
    // this.buyList[index].amount = !amount ? amount : amount + '.00';
  }

  onAssetChange(event, index) {
    console.log('onAssetChange', event);
    this.byFundArray[index].fund = undefined;
    this.byFundArray[index].amount = null;
    this.byFundArray[index].effectiveDate = undefined;
    this.byFundArray[index].isErrorMinimum = false;
    if (_.isNaN(this.byFundArray[index].amount)) {
      this.byFundArray[index].amount = undefined;
    }
    console.log('byFundArray', this.byFundArray);
    this.byFundData.emit(this.byFundArray);
  }

  onFundChange(event, index) {
    console.log('onFundChange', event);
    if (event) {
      this.fundId = event ? event.id : undefined;
      this.byFundArray[index].fundCode = event.fundCode;
      this.byFundArray[index].amcCode = event.amcCode;
      this.byFundArray[index].amount = null;
      this.byFundArray[index].effectiveDate = undefined;
      this.byFundArray[index].isErrorMinimum = false;
      const findFundDouble = _.filter(this.byFundArray, b => b.fundCode === event.fundCode);
      console.log('findFundDouble', findFundDouble);
      if (findFundDouble.length > 1) {
        this.byFundArray[index].isFundDouble = true;
      } else {
        this.byFundArray[index].isFundDouble = false;
      }
    } else {
      this.byFundArray[index].amcCode = undefined;
    }

    this.getFundById(index);

  }


  getFundById(index) {

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.fundService.fundByIdGet$(this.fundId, this.fundPlansId).subscribe(data => {
      console.log('dataa fundd', data);
      this.fundData = data;
      this.byFundArray[index].minimum = this.fundData.unitholderId ? this.fundData.nxtLowBuy : this.fundData.fstLowBuy;

      // chack Holidays //
      this.disabledDates = data.fundHolidays.map(fundHoliday => moment(fundHoliday).toDate());
      this.disabledDates = this.disabledDates.concat(data.thaiHolidays.map(Holiday => moment(Holiday).toDate()));

      if (this.fundData.buyPeriodFlag === 'E') {
        this.disabledDates = this.disabledDates.concat(data.tradeCalendars?.subscription.map(td => moment(td).toDate()));
      } else if (this.fundData.buyPeriodFlag === 'O') {
        this.byFundArray[index].datesEnabled = data.tradeCalendars?.subscription.length !== 0 ? this.datesEnabled.concat(data.tradeCalendars?.subscription.map(td => moment(td).toDate())) : [undefined];
      } else {
        this.byFundArray[index].datesEnabled = [];
      }
      this.disabledDates = _.uniq(this.disabledDates);
      this.byFundArray[index].disabledDates = this.disabledDates;

      // chack cutOffTime //
      const cutOffDateTime = moment(this.fundData.buyCutOffTime, 'HH:mm');
      const currentTime = moment();
      let limitCutOffTime = null;
      if (this.acceptVulnerableFlag) {
        const systemCutoffDateTimeVulnerable = moment('1300', 'HH:mm');
        const isBeforeCutOffVulnerable = cutOffDateTime.isBefore(
          systemCutoffDateTimeVulnerable
        );
        limitCutOffTime = isBeforeCutOffVulnerable
          ? moment('0900', 'HH:mm')
          : moment('1300', 'HH:mm');
      } else {
        const systemCutoffDateTime = moment('1400', 'HH:mm');
        const isBeforeCutOff = cutOffDateTime.isBefore(systemCutoffDateTime);
        limitCutOffTime = isBeforeCutOff ? cutOffDateTime : systemCutoffDateTime;
      }

      console.log('limitCutOffTime', moment(limitCutOffTime).format('HH:mm'));
      this.byFundArray[index].cutOff = limitCutOffTime;
      const isBeforeCutOffCurrentTime = limitCutOffTime.isBefore(currentTime);
      this.minDate = isBeforeCutOffCurrentTime ? moment().add(1, 'day').toDate() : moment().toDate();
      this.byFundArray[index].minDate = this.minDate;
      this.byFundData.emit(this.byFundArray);

      console.log(' this.byFundArray........', this.byFundArray);
    });
  }
}
