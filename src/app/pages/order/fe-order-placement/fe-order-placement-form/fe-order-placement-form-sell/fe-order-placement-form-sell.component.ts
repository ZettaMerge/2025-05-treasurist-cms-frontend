import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { FundByIdDTO } from 'src/app/api/model/FundByIdDTO';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FundService } from '@api';
import { RedemptionListDTO } from '@model';
import { ControlContainer, NgForm } from '@angular/forms';
interface RedemptionListDTOCustom extends RedemptionListDTO {

  fund?: any;
  lowSellUnit?: any;
  lowSellVal?: any;
  cutOff?: any;
  isErrorMinimum?: boolean;
  isErrorMinimumHolding?: boolean;
  isFundDouble?: boolean;
  isErrorNumber?: boolean;
  isErrorSaleValue?: boolean;
  valHolder?: any;
  typeSell?: any;
  unitHolder?: any;
  nav?: any;
  lowBalVal?: any;
  lowBalUnit?: any;
  isSellAll?: any;
  disabledDates?: any[];
  minDate?: any;
  datesEnabled?: any[];

}
@Component({
  selector: 'fe-order-placement-form-sell',
  templateUrl: './fe-order-placement-form-sell.component.html',
  styleUrls: ['./fe-order-placement-form-sell.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]

})
export class FeOrderPlacementFormSellComponent implements OnInit, OnChanges {

  @Input() fcnAccountId;
  @Input() fundPlansId;
  @Input() customerId;
  @Input() type;
  @Input() acceptVulnerableFlag;
  @Output() sellFundData = new EventEmitter();
  sellFundArray: RedemptionListDTOCustom[];
  fundId: number;
  dataSub: Subscription;
  fundData: FundByIdDTO = {} as FundByIdDTO;
  cutOffTime = [];
  disabledDates = [];
  datesEnabled = [];
  maxDate = moment().add(3, 'month').toDate();
  minDate = moment().toDate();
  lists = [
    { id: 1, name: 'บาท', value: 'AMT' },
    { id: 2, name: 'หน่วย', value: 'UNIT' },
  ];


  constructor(
    private fundService: FundService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fcnAccountId || changes.type || changes.customerId) {

      this.sellFundArray = [
        {
          amount: null,
          channel: undefined,
          effectiveDate: undefined,
          forceEntry: undefined,
          fundCode: undefined,
          paymentType: undefined,
          redemptionType: undefined,
          unit: undefined,
          unitholderId: undefined,
          fund: undefined,
          lowSellUnit: undefined,
          lowSellVal: undefined,
          cutOff: undefined,
          isErrorMinimum: false,
          isErrorMinimumHolding: false,
          isFundDouble: false,
          isErrorNumber: false,
          isErrorSaleValue: false,
          valHolder: undefined,
          typeSell: { id: 1, name: 'บาท', value: 'AMT' },
          unitHolder: undefined,
          nav: undefined,
          lowBalVal: undefined,
          lowBalUnit: undefined,
          isSellAll: false,
          disabledDates: [],
          minDate: undefined,
          datesEnabled: [],
          sellAllUnitFlag: undefined,
        }];
      console.log('sellFundArray', this.sellFundArray);
      // for (let sellFund of this.sellFundArray) {

      // }
    }
  }


  ngOnInit(): void {
    console.log('sellFundArray', this.sellFundArray);
  }

  onChangeDate(index) {
    this.sellFundData.emit(this.sellFundArray);
  }

  deleteFund(index) {

    if (this.sellFundArray.length > 1) {
      // this.isAddDisable = false;
      this.sellFundArray.splice(index, 1);
    }
    this.sellFundData.emit(this.sellFundArray);
  }

  addFund(event) {

    this.sellFundArray.push({
      amount: null,
      channel: undefined,
      effectiveDate: undefined,
      forceEntry: undefined,
      fundCode: undefined,
      paymentType: undefined,
      redemptionType: undefined,
      unit: undefined,
      unitholderId: undefined,
      fund: undefined,
      lowSellUnit: undefined,
      lowSellVal: undefined,
      cutOff: undefined,
      isErrorMinimum: false,
      isErrorMinimumHolding: false,
      isFundDouble: false,
      isErrorNumber: false,
      isErrorSaleValue: false,
      valHolder: undefined,
      typeSell: { id: 1, name: 'บาท', value: 'AMT' },
      unitHolder: undefined,
      nav: undefined,
      lowBalVal: undefined,
      lowBalUnit: undefined,
      isSellAll: false,
      disabledDates: [],
      minDate: undefined,
      datesEnabled: [],
      sellAllUnitFlag: undefined,
    });

  }

  onClickSellAll(event, sellFundData, i) {
    console.log('selectAll......', event);
    this.sellFundArray[i].isSellAll = !sellFundData.isSellAll;
    this.sellFundArray[i].isErrorSaleValue = false;
    // set sellAll
    this.sellFundArray[i].sellAllUnitFlag = sellFundData.isSellAll ? 'Y' : 'N';
    console.log('onClickSellAll', sellFundData);
    if (this.sellFundArray[i].isSellAll && sellFundData.fundCode) {
      this.sellFundArray[i].amount = sellFundData.unitHolder;
      this.sellFundArray[i].typeSell = { id: 2, name: 'หน่วย', value: 'UNIT' };
      this.sellFundArray[i].isErrorMinimum = false;
      this.sellFundArray[i].isErrorMinimumHolding = false;
      // if (sellFundData.amount < sellFundData.lowSellUnit) {
      //   console.log('มูลค่าการขายต่ำกว่ามูลค่าขั้นต่ำในการขาย');
      //   this.sellFundArray[i].isErrorMinimum = true;
      //   this.sellFundArray[i].isErrorMinimumHolding = false;
      // } else {
      //   this.sellFundArray[i].isErrorMinimum = false;
      // }
    }
    this.sellFundData.emit(this.sellFundArray);
    console.log('sellFundArray', this.sellFundArray);

  }


  fundAmountSellChange(event, i, fundData) {
    // console.log('fundAmountSellChange....', fundData);
    console.log('fundData', this.fundData);
    if (event && fundData.typeSell?.value === 'AMT') {
      const valueBalanceBath = fundData.valHolder - _.toNumber(event);
      if (fundData.valHolder < event) {
        // console.log('มูลค่าการขายมากกว่ามูลค่าในพอร์ตที่ทำรายการได้');
        this.sellFundArray[i].isErrorSaleValue = true;
        this.sellFundArray[i].isErrorMinimum = false;
        this.sellFundArray[i].isErrorMinimumHolding = false;
      } else {
        this.sellFundArray[i].isErrorSaleValue = false;
        if (_.toNumber(event) < fundData.lowSellVal) {
          // console.log('มูลค่าการขายต่ำกว่ามูลค่าขั้นต่ำในการขาย');
          this.sellFundArray[i].isErrorMinimum = true;
          this.sellFundArray[i].isErrorMinimumHolding = false;
        } else {
          this.sellFundArray[i].isErrorMinimum = false;
        }

        if (valueBalanceBath < fundData.lowBalVal) {
          // console.log('มูลค่าหรือจำนวนหน่วยคงเหลือต่ำกว่าขั้นต่ำในการถือ');
          this.sellFundArray[i].isErrorMinimumHolding = true;
          this.sellFundArray[i].isErrorMinimum = false;
        } else {
          this.sellFundArray[i].isErrorMinimumHolding = false;
        }

      }

    } else {
      const valueBalanceUnit = fundData.unitHolder - _.toNumber(event);
      const valueBalanceBath = valueBalanceUnit * fundData.nav;

      if (event && fundData.unitHolder < _.toNumber(event)) {
        this.sellFundArray[i].isErrorSaleValue = true;
        this.sellFundArray[i].isErrorMinimum = false;
        this.sellFundArray[i].isErrorMinimumHolding = false;
      } else {
        this.sellFundArray[i].isErrorSaleValue = false;
        if (_.toNumber(event) < fundData.lowSellUnit) {
          console.log('มูลค่าการขายต่ำกว่ามูลค่าขั้นต่ำในการขาย');
          this.sellFundArray[i].isErrorMinimum = true;
          this.sellFundArray[i].isErrorMinimumHolding = false;
        } else {
          this.sellFundArray[i].isErrorMinimum = false;
        }

        if (!fundData.isSellAll  && valueBalanceUnit < fundData.lowBalUnit) {
          // console.log('มูลค่าหรือจำนวนหน่วยคงเหลือต่ำกว่าขั้นต่ำในการถือ /_ึ');
          this.sellFundArray[i].isErrorMinimumHolding = true;
          this.sellFundArray[i].isErrorMinimum = false;
        } else {
          this.sellFundArray[i].isErrorMinimumHolding = false;
        }
      }


    }

    this.sellFundData.emit(this.sellFundArray);
  }

  onBlurEvent(event, i, sellFundData) {
    // console.log('sellFundData', this.sellFundArray[i].amount);
    if (this.sellFundArray[i].amount) {
      if (sellFundData.typeSell.name === 'บาท') {
        this.sellFundArray[i].amount = sellFundData.amount + '.00';
      } else {
        this.sellFundArray[i].amount = sellFundData.amount + '.0000';
      }
    }

  }

  onFocusAmount(index) {
    if (this.sellFundArray[index].amount) {
      const amountSplit = _.split(this.sellFundArray[index].amount, '.');
      this.sellFundArray[index].amount = amountSplit[0];
    } else {
      this.sellFundArray[index].amount = null;
    }
  }

  onAssetChange(event, index) {
    // console.log('onAssetChange', event);
    // console.log('onAssetChange', this.sellFundArray);
    this.sellFundArray[index].isErrorMinimumHolding = false;
    this.sellFundArray[index].isErrorSaleValue = false;
    this.sellFundArray[index].isErrorMinimum = false;
    this.sellFundArray[index].amount = null;
    this.sellFundArray[index].typeSell = { id: 1, name: 'บาท', value: 'AMT' };
    this.sellFundArray[index].isSellAll = false;
    this.sellFundArray[index].effectiveDate = undefined;
    // if (_.isNaN(this.sellFundArray[index].amount)) {
    //   this.sellFundArray[index].amount = undefined;
    // }
    // console.log('sellFundArray', this.sellFundArray);
    this.sellFundData.emit(this.sellFundArray);
  }

  onFundChange(event, index) {
    // console.log('onFundChange', event);
    this.fundId = event ? event.id : undefined;
    this.sellFundArray[index].fundCode = event?.fundCode;
    this.sellFundArray[index].isErrorMinimumHolding = false;
    this.sellFundArray[index].isErrorSaleValue = false;
    this.sellFundArray[index].isErrorMinimum = false;
    this.sellFundArray[index].amount = null;
    this.sellFundArray[index].typeSell = { id: 1, name: 'บาท', value: 'AMT' };
    this.sellFundArray[index].isSellAll = false;
    this.sellFundArray[index].effectiveDate = undefined;
    const findFundDouble = _.filter(this.sellFundArray, b => b.fundCode === event?.fundCode);
    // console.log('findFundDouble', findFundDouble);
    if (findFundDouble.length > 1) {
      this.sellFundArray[index].isFundDouble = true;
    } else {
      this.sellFundArray[index].isFundDouble = false;
    }

    if (event) {
      this.getFundById(index);

    }


  }


  getFundById(index) {

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
    // console.log('this.fundPlansId', this.fundPlansId);
    this.dataSub = this.fundService.fundByIdGet$(this.fundId, this.fundPlansId).subscribe(data => {
      console.log('FundById', data);
      this.fundData = data;
      this.sellFundArray[index].cutOff = this.fundData.sellCutOffTime;
      this.sellFundArray[index].unitHolder = this.fundData.unit ? this.fundData.unit : 0;
      this.sellFundArray[index].valHolder = this.fundData.amount ? this.fundData.amount : 0;
      this.sellFundArray[index].lowSellUnit = this.fundData.lowSellUnit ? this.fundData.lowSellUnit : 0;
      this.sellFundArray[index].lowSellVal = this.fundData.lowSellValue ? this.fundData.lowSellValue : 0;
      this.sellFundArray[index].nav = this.fundData.nav;
      this.sellFundArray[index].lowBalVal = this.fundData.lowBalUnit * this.fundData.nav;
      this.sellFundArray[index].lowBalUnit = this.fundData.lowBalUnit ? this.fundData.lowBalUnit : 0;
      this.sellFundArray[index].unitholderId = this.fundData.unitholderId;
      this.sellFundArray[index].channel = 'MOB';
      this.sellFundArray[index].forceEntry = 'Y';
      this.sellFundArray[index].paymentType = 'ATS_SA';
      // console.log('sellFundArray.....', this.sellFundArray);
      // chack Holidays //
      this.disabledDates = data.fundHolidays.map(fundHoliday => moment(fundHoliday).toDate());
      this.disabledDates = this.disabledDates.concat(data.thaiHolidays.map(Holiday => moment(Holiday).toDate())
      );
      // check period flag   sell
      if (this.fundData.sellPeriodFlag === 'E') {
        this.disabledDates = this.disabledDates.concat(data.tradeCalendars?.redemption.map(td => moment(td).toDate()));
      } else if (this.fundData.sellPeriodFlag === 'O') {
        // console.log('buyPeriodFlag', 'O');
        this.sellFundArray[index].datesEnabled = data.tradeCalendars?.redemption.length !== 0 ? this.datesEnabled.concat(data.tradeCalendars?.redemption.map(td => moment(td).toDate())) : [undefined];
      } else {
        this.sellFundArray[index].datesEnabled = [];
      }

      this.disabledDates = _.uniq(this.disabledDates);
      this.sellFundArray[index].disabledDates = this.disabledDates;
      // console.log(' this.disabledDates', this.disabledDates);

      // chack cutOffTime //
      const cutOffDateTime = moment(this.fundData.sellCutOffTime, 'HH:mm');
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
      this.sellFundArray[index].cutOff = limitCutOffTime;
      const isBeforeCutOffCurrentTime = limitCutOffTime.isBefore(currentTime);
      this.minDate = isBeforeCutOffCurrentTime ? moment().add(1, 'day').toDate() : moment().toDate();

      this.sellFundData.emit(this.sellFundArray);
    });
  }

  onTypeSellChange(index, sellFundData) {
    this.sellFundArray[index].amount = undefined;
    this.sellFundArray[index].isErrorMinimumHolding = false;
    this.sellFundArray[index].isErrorSaleValue = false;
    this.sellFundArray[index].isErrorMinimum = false;

    this.sellFundData.emit(this.sellFundArray);
  }
}
