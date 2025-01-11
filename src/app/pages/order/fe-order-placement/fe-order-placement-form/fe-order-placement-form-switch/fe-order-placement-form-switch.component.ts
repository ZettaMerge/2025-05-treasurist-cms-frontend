import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { FundService } from '@api';
import { Subscription } from 'rxjs';
import { FundByIdDTO } from 'src/app/api/model/FundByIdDTO';
import * as moment from 'moment';
import * as _ from 'lodash';
import { SwitchingsListDTO } from '@model';

interface SwitchingsListDTOCustom extends SwitchingsListDTO {

  fundSWI?: SwitchInDTOCustom;
  fundSWO?: SwitchOutDTOCustom;
  isErrorMinimumSell?: boolean;
  isErrorMinimumInvest?: boolean;
  isErrorMinimumHolding?: boolean;
  isFundDouble?: boolean;
  isErrorSaleValue?: boolean;
  typeSell?: any;
  isSellAll?: boolean;
  minDate?: any;
  disabledDates?: any[];
  isFundSwoDouble?: boolean;
  isFundSwiDouble?: boolean;
  datesEnabled?: any[];

}

interface SwitchOutDTOCustom {
  swoLowSellUnit?: any;
  swoLowSellVal?: any;
  swoCutOff?: any;
  swoUnit?: any;
  swoVal?: any;
  swoNav?: any;
  swoLowBalVal?: any;
  swoLowBalUnit?: any;
  fondSwoCode?: any;
  balanceSwoVal?: any;
  balanceSwoUnit?: any;
}
interface SwitchInDTOCustom {
  swiLowSellUnit?: any;
  swiLowSellVal?: any;
  swiCutOff?: any;
  swiUnit?: any;
  swiVal?: any;
  swiNav?: any;
  swiLowBalVal?: any;
  swiLowBalUnit?: any;
  swiByMinimumVal?: any;
  swiByMinimumUnit?: any;
  fondSwiCode?: any;
  balanceSwiVal?: any;
  balanceSwiUnit?: any;
}

@Component({
  selector: 'fe-order-placement-form-switch',
  templateUrl: './fe-order-placement-form-switch.component.html',
  styleUrls: ['./fe-order-placement-form-switch.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FeOrderPlacementFormSwitchComponent implements OnInit, OnChanges {

  @Input() fcnAccountId;
  @Input() fundPlansId;
  @Input() type;
  @Input() customerId;
  @Input() acceptVulnerableFlag;
  @Input() form: NgForm;
  @Output() SwitchFundData = new EventEmitter();
  fundSwitchArray: SwitchingsListDTOCustom[];
  isTextError: string;
  fundId: number;
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

  dataSub: Subscription;
  constructor(private fundService: FundService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fcnAccountId || changes.type || changes.customerId) {

      this.fundSwitchArray = [{
        amount: null,
        counterFundCode: undefined,
        channel: undefined,
        effectiveDate: undefined,
        forceEntry: undefined,
        fundCode: undefined,
        redemptionType: undefined,
        unit: undefined,
        unitholderId: undefined,
        fundSWI: {
          swiLowSellUnit: undefined,
          swiLowSellVal: undefined,
          swiCutOff: undefined,
          swiUnit: undefined,
          swiVal: undefined,
          swiNav: undefined,
          swiLowBalVal: undefined,
          swiLowBalUnit: undefined,
          swiByMinimumVal: undefined,
          swiByMinimumUnit: undefined,
          fondSwiCode: undefined,
          balanceSwiVal: undefined,
          balanceSwiUnit: undefined,
        },
        fundSWO: {
          swoLowSellUnit: undefined,
          swoLowSellVal: undefined,
          swoCutOff: undefined,
          swoUnit: undefined,
          swoVal: undefined,
          swoNav: undefined,
          swoLowBalVal: undefined,
          swoLowBalUnit: undefined,
          fondSwoCode: undefined,
          balanceSwoVal: undefined,
          balanceSwoUnit: undefined,
        },
        isErrorMinimumSell: false,
        isErrorMinimumInvest: false,
        isErrorMinimumHolding: false,
        isFundDouble: false,
        isErrorSaleValue: false,
        typeSell: { id: 1, name: 'บาท', value: 'AMT' },
        isSellAll: false,
        minDate: undefined,
        disabledDates: [],
        isFundSwoDouble: false,
        isFundSwiDouble: false,
        datesEnabled: [],
        sellAllUnitFlag: undefined,
      }];
      console.log('fundSwitchArray', this.fundSwitchArray);
    }
  }

  addFund(event) {
    this.fundSwitchArray.push({
      amount: null,
      counterFundCode: undefined,
      channel: undefined,
      effectiveDate: undefined,
      forceEntry: undefined,
      fundCode: undefined,
      redemptionType: undefined,
      unit: undefined,
      unitholderId: undefined,
      fundSWI: {
        swiLowSellUnit: undefined,
        swiLowSellVal: undefined,
        swiCutOff: undefined,
        swiUnit: undefined,
        swiVal: undefined,
        swiNav: undefined,
        swiLowBalVal: undefined,
        swiLowBalUnit: undefined,
        swiByMinimumVal: undefined,
        swiByMinimumUnit: undefined,
        fondSwiCode: undefined,
        balanceSwiVal: undefined,
        balanceSwiUnit: undefined,
      },
      fundSWO: {
        swoLowSellUnit: undefined,
        swoLowSellVal: undefined,
        swoCutOff: undefined,
        swoUnit: undefined,
        swoVal: undefined,
        swoNav: undefined,
        swoLowBalVal: undefined,
        swoLowBalUnit: undefined,
        fondSwoCode: undefined,
        balanceSwoVal: undefined,
        balanceSwoUnit: undefined,

      },

      isErrorMinimumSell: false,
      isErrorMinimumInvest: false,
      isErrorMinimumHolding: false,
      isFundDouble: false,
      isErrorSaleValue: false,
      typeSell: { id: 1, name: 'บาท', value: 'AMT' },
      isSellAll: false,
      minDate: undefined,
      disabledDates: [],
      isFundSwoDouble: false,
      isFundSwiDouble: false,
      datesEnabled: [],
      sellAllUnitFlag: undefined,

    });

  }

  deleteFund(index, switchingData) {
    console.log('deleteFund', switchingData);
    if (this.fundSwitchArray.length > 1) {
      this.fundSwitchArray.splice(index, 1);
    }


    this.SwitchFundData.emit(this.fundSwitchArray);
  }

  onChangeDate(index) {
    this.SwitchFundData.emit(this.fundSwitchArray);
  }


  onChangeFundSWO(event, index, switchingData) {
    this.fundId = event ? event.id : undefined;
    this.fundSwitchArray[index].isFundDouble = false;
    this.fundSwitchArray[index].isErrorSaleValue = false;
    this.fundSwitchArray[index].isErrorMinimumSell = false;
    this.fundSwitchArray[index].isErrorMinimumHolding = false;
    this.fundSwitchArray[index].isFundSwoDouble = false;
    this.fundSwitchArray[index].amount = null;
    this.fundSwitchArray[index].typeSell = { id: 1, name: 'บาท', value: 'AMT' };
    this.fundSwitchArray[index].isSellAll = false;
    this.fundSwitchArray[index].effectiveDate = undefined;
    // console.log('event.id', event.id);
    if (this.fundSwitchArray[index]?.fundSWO?.fondSwoCode?.fundCode && this.fundSwitchArray[index]?.fundSWI?.fondSwiCode?.fundCode) {
      if (this.fundSwitchArray[index]?.fundSWO?.fondSwoCode?.fundCode === this.fundSwitchArray[index]?.fundSWI?.fondSwiCode?.fundCode) {
        this.fundSwitchArray[index].isFundDouble = true;
      }
    }

    if (event) {
      console.log('switchingData', switchingData);
      this.getFundById(index, 'fundSWO');
    }

  }

  onChangeFundSWI(event, index) {
    console.log('onChangeFundSWI', event);
    this.fundId = event ? event.id : undefined;
    this.fundSwitchArray[index].isFundDouble = false;
    this.fundSwitchArray[index].isErrorSaleValue = false;
    this.fundSwitchArray[index].isErrorMinimumSell = false;
    this.fundSwitchArray[index].isErrorMinimumHolding = false;
    this.fundSwitchArray[index].isErrorMinimumInvest = false;
    this.fundSwitchArray[index].isFundSwoDouble = false;
    this.fundSwitchArray[index].amount = null;
    this.fundSwitchArray[index].isFundSwiDouble = false;
    this.fundSwitchArray[index].typeSell = { id: 1, name: 'บาท', value: 'AMT' };
    this.fundSwitchArray[index].isSellAll = false;
    const findFundSwiDouble = _.filter(this.fundSwitchArray, b => b.fundSWI?.fondSwiCode?.id === event?.id);
    console.log('findFundSwiDouble', findFundSwiDouble);
    if (findFundSwiDouble.length > 1) {
      this.fundSwitchArray[index].isFundSwiDouble = true;
    }

    if (this.fundSwitchArray[index].fundSWO?.fondSwoCode?.fundCode === this.fundSwitchArray[index].fundSWI?.fondSwiCode?.fundCode) {
      console.log('isFundDouble');
      this.fundSwitchArray[index].isFundDouble = true;
    }
    if (event) {
      this.getFundById(index);
    }
    console.log('fundSwitchArray....2', this.fundSwitchArray);

  }

  getFundById(index, typeFund?) {

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
    console.log('this.fundPlansId', this.fundPlansId);
    this.dataSub = this.fundService.fundByIdGet$(this.fundId, this.fundPlansId).subscribe(data => {
      console.log('FundById', data);
      this.fundData = data;
      this.fundSwitchArray[index].channel = 'MOB';
      this.fundSwitchArray[index].forceEntry = 'Y';


      if (typeFund === 'fundSWO') {
        this.fundSwitchArray[index].fundSWO.swoCutOff = this.fundData.sellCutOffTime;
        this.fundSwitchArray[index].fundSWO.swoUnit = this.fundData.unit ? this.fundData.unit : 0;
        this.fundSwitchArray[index].fundSWO.swoVal = this.fundData.amount ? this.fundData.amount : 0;
        this.fundSwitchArray[index].fundSWO.swoLowSellUnit = this.fundData.convertLowBalUnit ? this.fundData.convertLowBalUnit : 0;
        this.fundSwitchArray[index].fundSWO.swoLowSellVal = this.fundData.convertLowSellVal ? this.fundData.convertLowSellVal : 0;
        this.fundSwitchArray[index].fundSWO.swoNav = this.fundData.nav;
        this.fundSwitchArray[index].fundSWO.swoLowBalVal = this.fundData.lowBalUnit * this.fundData.nav;
        this.fundSwitchArray[index].fundSWO.swoLowBalUnit = this.fundData.lowBalUnit ? this.fundData.lowBalUnit : 0;
        this.fundSwitchArray[index].unitholderId = this.fundData.unitholderId;

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
        this.fundSwitchArray[index].fundSWO.swoCutOff = limitCutOffTime;
        const isBeforeCutOffCurrentTime = limitCutOffTime.isBefore(currentTime);
        this.minDate = isBeforeCutOffCurrentTime ? moment().add(1, 'day').toDate() : moment().toDate();
        this.fundSwitchArray[index].minDate = this.minDate;
        // console.log('fundSwitchArray.....', this.fundSwitchArray);
        this.disabledDates = data.fundHolidays.map(fundHoliday => moment(fundHoliday).toDate());
        this.disabledDates = this.disabledDates.concat(data.thaiHolidays.map(Holiday => moment(Holiday).toDate())
        );

        // check period flag   switching
        // switchOutPeriodFlag
        if (this.fundData.switchInPeriodFlag === 'E') {
          this.disabledDates = this.disabledDates.concat(data.tradeCalendars?.switchingIn.map(td => moment(td).toDate()));
        } else if (this.fundData.switchInPeriodFlag === 'O') {
          this.fundSwitchArray[index].datesEnabled = data.tradeCalendars?.switchingIn.length !== 0 ? this.datesEnabled.concat(data.tradeCalendars?.switchingIn.map(td => moment(td).toDate())) : [undefined];
        } else {
          this.fundSwitchArray[index].datesEnabled = [];
        }

        this.disabledDates = _.uniq(this.disabledDates);
        this.fundSwitchArray[index].disabledDates = this.disabledDates;
      } else {
        this.fundSwitchArray[index].fundSWI.swiCutOff = this.fundData.sellCutOffTime;
        this.fundSwitchArray[index].fundSWI.swiUnit = this.fundData.unit ? this.fundData.unit : 0;
        this.fundSwitchArray[index].fundSWI.swiVal = this.fundData.amount ? this.fundData.amount : 0;
        this.fundSwitchArray[index].fundSWI.swiLowSellUnit = this.fundData.lowSellUnit ? this.fundData.lowSellUnit : 0;
        this.fundSwitchArray[index].fundSWI.swiLowSellVal = this.fundData.lowSellValue ? this.fundData.lowSellValue : 0;
        this.fundSwitchArray[index].fundSWI.swiNav = this.fundData.nav;
        this.fundSwitchArray[index].fundSWI.swiLowBalVal = this.fundData.convertLowBalVal ? this.fundData.convertLowBalVal : 0;
        this.fundSwitchArray[index].fundSWI.swiLowBalUnit = this.fundData.convertLowBalUnit ? this.fundData.convertLowBalUnit : 0;
        this.fundSwitchArray[index].fundSWI.swiByMinimumVal = this.fundData.unitholderId ? this.fundData.nxtLowBuy : this.fundData.fstLowBuy;
        this.fundSwitchArray[index].fundSWI.swiByMinimumUnit = this.fundData.unitholderId ? this.fundData.nxtLowBuy / this.fundData.nav : this.fundData.fstLowBuy / this.fundData.nav;
      }
      this.SwitchFundData.emit(this.fundSwitchArray);

    });
  }

  fundAmountSWHChange(event, i, switchingData) {
    console.log('switchingData', switchingData);
    if (event && switchingData.typeSell.value === 'AMT') {
      const valueBalanceBath = switchingData.fundSWO.swoVal - _.toNumber(event);
      console.log('valueBalanceBath', valueBalanceBath);
      if (switchingData.fundSWO.swoVal < event) {
        this.fundSwitchArray[i].isErrorSaleValue = true;
        this.fundSwitchArray[i].isErrorMinimumSell = false;
        this.fundSwitchArray[i].isErrorMinimumHolding = false;
        this.fundSwitchArray[i].isErrorMinimumInvest = false;
      } else {
        this.fundSwitchArray[i].isErrorSaleValue = false;

        if (_.toNumber(event) < switchingData.fundSWO.swoLowSellVal) {
          console.log('มูลค่าการขายต่ำกว่ามูลค่าขั้นต่ำในการขาย');
          this.fundSwitchArray[i].isErrorMinimumSell = true;
          this.fundSwitchArray[i].isErrorMinimumHolding = false;
          this.fundSwitchArray[i].isErrorMinimumInvest = false;
        } else {
          this.fundSwitchArray[i].isErrorMinimumSell = false;
        }

        if (_.toNumber(event) < switchingData.fundSWI.swiByMinimumVal) {
          console.log('จำนวนเงินลงทุนน้อยกว่าจำนวนเงินขั้นต่ำที่กำหนด');
          this.fundSwitchArray[i].isErrorMinimumInvest = true;
          this.fundSwitchArray[i].isErrorMinimumSell = false;
          this.fundSwitchArray[i].isErrorMinimumHolding = false;
        } else {
          this.fundSwitchArray[i].isErrorMinimumInvest = false;
        }

        if (valueBalanceBath < switchingData.fundSWO.swoLowBalVal) {
          this.fundSwitchArray[i].isErrorMinimumHolding = true;
          this.fundSwitchArray[i].isErrorMinimumSell = false;
          this.fundSwitchArray[i].isErrorMinimumInvest = false;
        } else {
          this.fundSwitchArray[i].isErrorMinimumHolding = false;
        }
      }

    } else {
      const valueBalanceUnit = switchingData.fundSWO.swoUnit - _.toNumber(event);
      const swiByMinimumBalBath = switchingData.fundSWI.swiByMinimumVal / switchingData.fundSWI.swiNav;
      // console.log('swiByMinimumBalUnit', swiByMinimumBalBath);
      if (switchingData.fundSWO.swoUnit < _.toNumber(event) ) {
        this.fundSwitchArray[i].isErrorSaleValue = true;
        this.fundSwitchArray[i].isErrorMinimumSell = false;
        this.fundSwitchArray[i].isErrorMinimumHolding = false;
        this.fundSwitchArray[i].isErrorMinimumInvest = false;
      } else {
        this.fundSwitchArray[i].isErrorSaleValue = false;
        if (_.toNumber(event)  < switchingData.fundSWO.swoLowBalUnit) {
          console.log('มูลค่าการขายต่ำกว่ามูลค่าขั้นต่ำในการขาย');
          this.fundSwitchArray[i].isErrorMinimumSell = true;
          this.fundSwitchArray[i].isErrorMinimumHolding = false;
          this.fundSwitchArray[i].isErrorMinimumInvest = false;
        } else {
          this.fundSwitchArray[i].isErrorMinimumSell = false;
        }

        if (_.toNumber(event)  < switchingData.fundSWI.swiByMinimumUnit) {
          console.log('จำนวนเงินลงทุนน้อยกว่าจำนวนเงินขั้นต่ำที่กำหนด');
          this.fundSwitchArray[i].isErrorMinimumInvest = true;
          this.fundSwitchArray[i].isErrorMinimumSell = false;
          this.fundSwitchArray[i].isErrorMinimumHolding = false;
        } else {
          this.fundSwitchArray[i].isErrorMinimumInvest = false;
        }

        if (!switchingData.isSellAll && valueBalanceUnit < switchingData.fundSWO.swoLowBalUnit) {
          console.log('มูลค่าหรือจำนวนหน่วยคงเหลือต่ำกว่าขั้นต่ำในการถือ');
          this.fundSwitchArray[i].isErrorMinimumHolding = true;
          this.fundSwitchArray[i].isErrorMinimumSell = false;
          this.fundSwitchArray[i].isErrorMinimumInvest = false;
        } else {
          this.fundSwitchArray[i].isErrorMinimumHolding = false;
        }
      }
    }

    // this.SwitchFundData.emit(this.fundSwitchArray);

  }

  onFocusAmount(index) {
    console.log('onFocusAmount', this.fundSwitchArray[index].amount);
    if (this.fundSwitchArray[index].amount) {
      const amountSplit = _.split(this.fundSwitchArray[index].amount, '.');
      this.fundSwitchArray[index].amount = amountSplit[0];
    } else {
      this.fundSwitchArray[index].amount = null;
    }
  }


  onBlurEvent(event, i, fund) {
    console.log('onBlurEvent', fund.amount);
    if (fund.amount) {
      if (fund.typeSell.value === 'AMT') {
        this.fundSwitchArray[i].amount = fund.amount + '.00';
      } else {
        this.fundSwitchArray[i].amount = fund.amount + '.0000';
      }
    }

    this.SwitchFundData.emit(this.fundSwitchArray);
  }

  onClickSellAll(event, switchFundData, i) {
    this.fundSwitchArray[i].isSellAll = !switchFundData.isSellAll;
    this.fundSwitchArray[i].isErrorSaleValue = false;
    this.fundSwitchArray[i].isErrorMinimumInvest = false;

    // set sellAllUnit
    this.fundSwitchArray[i].sellAllUnitFlag = switchFundData.isSellAll ? 'Y' : 'N';

    // console.log('onClickSellAll', switchFundData);
    // console.log('swoUnit', switchFundData.fundSWO.swoUnit);
    // console.log('fundCode', switchFundData.fundSWO.fundCode);
    if (this.fundSwitchArray[i].isSellAll && switchFundData.fundSWO.fondSwoCode) {
      console.log('swoUnit', switchFundData.fundSWO.swoUnit);
      this.fundSwitchArray[i].amount = switchFundData.fundSWO.swoUnit;
      this.fundSwitchArray[i].typeSell = { id: 2, name: 'หน่วย', value: 'UNIT' };
      this.fundSwitchArray[i].isErrorMinimumSell = false;
      this.fundSwitchArray[i].isErrorMinimumHolding = false;
      // const swiByMinimumBath = this.fundSwitchArray[i].amount * switchFundData.fundSWI.swiNav;
      if (this.fundSwitchArray[i].amount < this.fundSwitchArray[i].fundSWI.swiByMinimumUnit) {
        console.log('จำนวนเงินลงทุนน้อยกว่าจำนวนเงินขั้นต่ำที่กำหนด');
        this.fundSwitchArray[i].isErrorMinimumInvest = true;
        this.fundSwitchArray[i].isErrorMinimumSell = false;
        this.fundSwitchArray[i].isErrorMinimumHolding = false;
      } else {
        this.fundSwitchArray[i].isErrorMinimumInvest = false;
      }


    }

    this.SwitchFundData.emit(this.fundSwitchArray);
    console.log('fundSwitchArray', this.fundSwitchArray);

  }

  onTypeSellChange(index, switchFundData) {
    this.fundSwitchArray[index].amount = undefined;
    this.fundSwitchArray[index].isErrorMinimumHolding = false;
    this.fundSwitchArray[index].isErrorSaleValue = false;
    this.fundSwitchArray[index].isErrorMinimumSell = false;

    this.SwitchFundData.emit(this.fundSwitchArray);
  }

}


