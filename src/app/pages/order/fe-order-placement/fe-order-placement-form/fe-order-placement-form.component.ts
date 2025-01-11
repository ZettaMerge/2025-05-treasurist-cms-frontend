import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerService, OrderService } from '@api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, merge } from 'rxjs/operators';
import * as _ from 'lodash';
import { FundPlanDTO, RecurringSubscriptionsDTO, RedemptionDTO, RedemptionListDTO, SubscriptionDTO, SubscriptionListDTO, SwitchingsDTO, UserDTO } from '@model';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { mergeMap } from 'rxjs/operators';
import { consolidateMessages } from '@angular/localize/src/tools/src/extract/translation_files/utils';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'fe-order-placement-form',
  templateUrl: './fe-order-placement-form.component.html',
  styleUrls: ['./fe-order-placement-form.component.scss']
})
export class FeOrderPlacementFormComponent implements OnInit {

  @Input() isNew;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  fileCoverPreview;
  fileCoverFile;
  fileCoverPreviewName;
  fileName;

  customerData: any;
  user: UserDTO = {} as UserDTO;
  fundPlanUser: FundPlanDTO = {} as FundPlanDTO;
  fundPlan: any;
  status = 1;
  type = 'BUY';

  paymentMethod = { id: 1, name: 'ATS_SA' };
  bank = environment.bankFix;
  orderType = 'switch';
  customerId: number;
  acceptVulnerableFlag: boolean;
  isTextError: string;
  searching = false;
  searchFailed = false;
  isShowBuy = true;
  isShowSell = false;
  isShowSwitch = false;
  isShowDca = false;
  isShowBank = false;
  isShowUploadFile = false;
  listsFundPlanDropdown;
  listsCustomerDropdown;
  fcnAccountId: string;
  fundPlansId: number;
  isErrorFundDouble = false;
  isErrorUploadFile = false;
  submitted = false;
  TotalAmount: number;
  sellFundData = [];
  redemptionArrayData = [];
  redemptionData: RedemptionDTO = {} as RedemptionDTO;
  subscriptionArrayData = [];
  subscriptionData: SubscriptionDTO = {} as SubscriptionDTO;
  switchingArrayData = [];
  switchingData: SwitchingsDTO = {} as SwitchingsDTO;
  recurringSubscriptionArrayData = [];
  recurringSubscriptionData: RecurringSubscriptionsDTO = {} as RecurringSubscriptionsDTO;
  textErrorFailedSave = [];
  textSuccessSave = [];
  isErrorMinimumHolding = false;
  textErrorMinimumHolding: string;
  dcaFundArray = [
    {
      amcCode: undefined,
      fundCode: undefined,
      amount: undefined,
      minimum: undefined,
      isErrorMinimum: false,
      isFundDouble: false,
      isErrorNumber: false,
    }
  ];


  checkListTypes = [
    { id: 1, name: 'BUY' },
    { id: 2, name: 'SELL' },
    { id: 3, name: 'SWITCH' },
    { id: 4, name: 'DCA' },
  ];

  listsPaymentMethod = [
    { id: 1, name: 'ATS_SA' },
    { id: 2, name: 'TRN_SA' },
  ];


  debitTypeList = [
    { value: 1, label: 'รายสัปดาห์' },
    { value: 0, label: 'รายเดือน' }
  ];




  saveSub: Subscription;
  constructor(
    private spinner: NgxSpinnerService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private toastrService: ToastrService,
    protected cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.getCustomerDropdown();

  }

  onChangeNameCustomer(event, customerData) {
    console.log('onChangeNameCustomer', customerData);
    this.acceptVulnerableFlag = event?.vulnerableFlag;
    this.fundPlan = undefined;
    const userId: number = _.toNumber(event?.id);
    this.user.id = userId;
    if (this.type === 'BUY') {
      this.subscriptionData.user = this.user;
    }
    if (this.type === 'SELL') {
      this.redemptionData.user = this.user;
    }

    if (this.type === 'SWITCH') {
      this.switchingData.user = this.user;

    }

    if (this.type === 'DCA') {
      this.recurringSubscriptionData.user = this.user;
    }

    this.customerId = event ? event?.id : null;
    if (event) {
      this.getFundPlan();
    }


  }

  onChangeFundPlan(event) {
    console.log('onChangeFundPlan', event);
    console.log('fundPlan', this.fundPlan);
    this.fundPlansId = event ? event.id : undefined;
    this.fcnAccountId = event ? event.fcnAccountId : undefined;
    this.fundPlanUser.id = this.fundPlansId;
    if (this.type === 'BUY') {
      this.subscriptionData.fundPlan = this.fundPlanUser;
    }
    if (this.type === 'SELL') {
      this.redemptionData.fundPlan = this.fundPlanUser;
    }

    if (this.type === 'SWITCH') {
      this.switchingData.fundPlan = this.fundPlanUser;
    }

    if (this.type === 'DCA') {
      this.recurringSubscriptionData.fundPlan = this.fundPlanUser;
    }

  }

  onSave(form) {
    console.log('form', form);
    this.spinner.show('global');
    this.isErrorMinimumHolding = false;
    const isErrorMinimumByFund = _.findIndex(this.subscriptionArrayData, ['isErrorMinimum', true]);
    const isFundDoubleByFund = _.findIndex(this.subscriptionArrayData, ['isFundDouble', true]);
    const isErrorNumberByFund = _.findIndex(this.subscriptionArrayData, ['isErrorNumber', true]);

    const isErrorMinimumSell = _.findIndex(this.redemptionArrayData, ['isErrorMinimum', true]);
    const isErrorMinimumHoldingSell = _.findIndex(this.redemptionArrayData, ['isErrorMinimumHolding', true]);
    const isFundDoubleSell = _.findIndex(this.redemptionArrayData, ['isFundDouble', true]);
    const isErrorSaleValueSell = _.findIndex(this.redemptionArrayData, ['isErrorSaleValue', true]);

    const isErrorMinimumDca = _.findIndex(this.recurringSubscriptionArrayData, ['isErrorMinimum', true]);
    const isFundDoubleDca = _.findIndex(this.recurringSubscriptionArrayData, ['isFundDouble', true]);
    const isErrorEffectiveDateStartDca = _.findIndex(this.recurringSubscriptionArrayData, ['isErrorEffectiveDateStart', true]);
    const isErrorEffectiveDateEndDca = _.findIndex(this.recurringSubscriptionArrayData, ['isErrorEffectiveDateEnd', true]);


    const isErrorMinimumSwitching = _.findIndex(this.switchingArrayData, ['isErrorMinimumSell', true]);
    const isErrorMinimumInvestSwitching = _.findIndex(this.switchingArrayData, ['isErrorMinimumInvest', true]);
    const isErrorMinimumHoldingSwitching = _.findIndex(this.switchingArrayData, ['isErrorMinimumHolding', true]);
    const isFundDoubleSwitching = _.findIndex(this.switchingArrayData, ['isFundDouble', true]);
    const isErrorSaleValueSwitching = _.findIndex(this.switchingArrayData, ['isErrorSaleValue', true]);
    const isFundSwoDoubleSwitching = _.findIndex(this.switchingArrayData, ['isFundSwoDouble', true]);
    const isFundSwiDoubleSwitching = _.findIndex(this.switchingArrayData, ['isFundSwiDouble', true]);


    // เช็ค witching out กองทุน ซ้ำ
    const foundDuplicate = this.switchingArrayData.find((fond, index) => {
      return this.switchingArrayData.find((x, i) => x.fundSWO?.fondSwoCode?.fundCode === fond.fundSWO?.fondSwoCode?.fundCode && index !== i);
    });
    // console.log('foundDuplicate', foundDuplicate);
    const switchingData = _.cloneDeep(this.switchingArrayData);
    const duplicateSwitching = _.remove(switchingData, (n) => n.fundSWO?.fondSwoCode?.fundCode === foundDuplicate?.fundSWO?.fondSwoCode?.fundCode);
    for (const duplicateData of duplicateSwitching) {
      duplicateData.amount = _.toNumber(duplicateData.amount);
    }
    // console.log('duplicateSwitching', duplicateSwitching);
    const sumAmount = _.sumBy(duplicateSwitching, 'amount');
    const swoLowBalVal = foundDuplicate?.fundSWO?.swoLowBalVal;
    const swoLowBalUnit = foundDuplicate?.fundSWO?.swoLowBalVal;
    const valueBalance = foundDuplicate?.fundSWO?.swoVal - sumAmount;
    const valueBalanceUnit = valueBalance / foundDuplicate?.fundSWO?.swoNav;
    // console.log('sumAmount', sumAmount);
    // console.log('swoLowBalVal', swoLowBalVal);
    // console.log('swoLowBalUnit', swoLowBalUnit);
    // console.log('valueBalance', valueBalance);
    // console.log('valueBalanceUnit', valueBalanceUnit);
    if (foundDuplicate) {
      if (foundDuplicate?.typeSell?.value === 'AMT') {
        if (valueBalance < swoLowBalVal) {
          console.log('มูลค่าหรือจำนวนหน่วยคงเหลือต่ำกว่าขั้นต่ำในการถือ');
          this.isErrorMinimumHolding = true;
          this.textErrorMinimumHolding = `กองทุน ${foundDuplicate?.fundSWO?.fondSwoCode?.fundCode} มูลค่าหรือจำนวนหน่วยคงเหลือต่ำกว่าขั้นต่ำในการถือ`;
        } else {
          this.isErrorMinimumHolding = false;
        }
      } else {
        if (valueBalanceUnit < swoLowBalUnit) {
          console.log('มูลค่าหรือจำนวนหน่วยคงเหลือต่ำกว่าขั้นต่ำในการถือ');
          this.isErrorMinimumHolding = true;
          this.textErrorMinimumHolding = `กองทุน ${foundDuplicate?.fundSWO?.fondSwoCode?.fundCode} มูลค่าหรือจำนวนหน่วยคงเหลือต่ำกว่าขั้นต่ำในการถือ`;
        } else {
          this.isErrorMinimumHolding = false;
        }
      }
    }

    if (form.invalid) {
      this.submitted = true;
      this.spinner.hide('global');
      return;
    }

    if (this.isErrorMinimumHolding) {
      this.submitted = true;
      this.spinner.hide('global');
      return;
    }

    if (isErrorMinimumByFund > -1 || isFundDoubleByFund > -1 || isErrorNumberByFund > -1) {
      this.submitted = true;
      this.spinner.hide('global');
      return;
    }

    if (isErrorMinimumSell > -1 || isErrorMinimumHoldingSell > -1 || isFundDoubleSell > -1 || isErrorSaleValueSell > -1) {
      // console.log('valid');
      this.submitted = true;
      this.spinner.hide('global');
      return;
    }

    if (isErrorMinimumSwitching > -1 || isErrorMinimumInvestSwitching > -1 || isErrorMinimumHoldingSwitching > -1 || isFundDoubleSwitching > -1 ||
      isErrorSaleValueSwitching > -1 || isFundSwoDoubleSwitching > -1 || isFundSwiDoubleSwitching > -1) {
      this.submitted = true;
      this.spinner.hide('global');
      return;
    }

    if (this.paymentMethod?.name === 'TRN_SA' && !this.fileCoverFile) {
      this.submitted = true;
      this.isErrorUploadFile = true;
      this.spinner.hide('global');
      return;
    }

    if (isErrorMinimumDca > -1 || isFundDoubleDca > -1 || isErrorEffectiveDateStartDca > -1 || isErrorEffectiveDateEndDca > -1) {
      this.submitted = true;
      this.spinner.hide('global');
      return;
    }

    for (const subscription of this.subscriptionArrayData) {

      if (this.paymentMethod?.name === 'TRN_SA') {
        subscription.paymentType = 'TRN_SA';
      } else {
        subscription.paymentType = 'ATS_SA';
      }
      // delete subscription.redemptionType;
      delete subscription.fund;
      delete subscription.amcCode;
      delete subscription.minimum;
      delete subscription.cutOff;
      delete subscription.isErrorMinimum;
      delete subscription.isFundDouble;
      delete subscription.isFundDouble;
      delete subscription.disabledDates;
      delete subscription.minDate;
      delete subscription.datesEnabled;
    }

    for (const redemption of this.redemptionArrayData) {

      if (redemption.redemptionType === 'AMT') {
        delete redemption.unit;
      } else {
        delete redemption.amount;
      }
      delete redemption.fund;
      delete redemption.lowSellUnit;
      delete redemption.lowSellVal;
      delete redemption.cutOff;
      delete redemption.isErrorMinimum;
      delete redemption.isErrorMinimumHolding;
      delete redemption.isFundDouble;
      delete redemption.isErrorNumber;
      delete redemption.isErrorSaleValue;
      delete redemption.valHolder;
      delete redemption.typeSell;
      delete redemption.unitHolder;
      delete redemption.nav;
      delete redemption.lowBalVal;
      delete redemption.lowBalUnit;
      delete redemption.isSellAll;
      delete redemption.disabledDates;
      delete redemption.minDate;
      delete redemption.datesEnabled;
    }

    for (const switching of this.switchingArrayData) {

      if (switching.redemptionType === 'AMT') {
        delete switching.unit;
      } else {
        delete switching.amount;
      }
      delete switching.fundSWI;
      delete switching.fundSWO;
      delete switching.isErrorMinimumSell;
      delete switching.isErrorMinimumInvest;
      delete switching.isErrorBlNotEnough;
      delete switching.isErrorMinimumHolding;
      delete switching.isFundDouble;
      delete switching.isErrorNumber;
      delete switching.isErrorSaleValue;
      delete switching.typeSell;
      delete switching.isSellAll;
      delete switching.minDate;
      delete switching.disabledDates;
      delete switching.isFundSwoDouble;
      delete switching.isFundSwiDouble;
      delete switching.datesEnabled;

    }

    for (const recurringSubscription of this.recurringSubscriptionArrayData) {

      delete recurringSubscription.fund;
      delete recurringSubscription.amcCode;
      delete recurringSubscription.minimum;
      delete recurringSubscription.cutOff;
      delete recurringSubscription.isErrorMinimum;
      delete recurringSubscription.isFundDouble;
      delete recurringSubscription.isErrorNumber;
      delete recurringSubscription.isErrorEffectiveDateStart;
      delete recurringSubscription.isErrorEffectiveDateEnd;

    }


    console.log('subscriptionArrayData', this.subscriptionArrayData);
    console.log('switchingArrayData', this.switchingArrayData);


    if (this.saveSub) {
      this.saveSub.unsubscribe();
    }

    this.submitted = false;
    this.textErrorFailedSave = [];
    let req;
    console.log('type', this.type);
    if (this.type === 'BUY') {
      this.subscriptionData.subscriptions = this.subscriptionArrayData;
      if (this.paymentMethod?.name === 'TRN_SA') {
        if (this.fileCoverFile) {
          req = this.orderService.orderTransactionUploadFilePost$(this.fileCoverFile, this.user?.id)
            .pipe(
              mergeMap(file => {
                console.log('file', file);
                this.subscriptionData.slipPath = file;
                return this.orderService.orderTransactionSubscriptionPost$(this.subscriptionData);
              })
            );
        }
      } else {
        this.subscriptionData.slipPath = null;
        req = this.orderService.orderTransactionSubscriptionPost$(this.subscriptionData);
      }
      console.log('subscriptionData...save', this.subscriptionData);
    } else if (this.type === 'SELL') {
      this.redemptionData.redemptions = this.redemptionArrayData;
      req = this.orderService.orderTransactionRedemptionPost$(this.redemptionData);
    } else if (this.type === 'SWITCH') {

      this.switchingData.switchings = this.switchingArrayData;
      req = this.orderService.orderTransactionSwitchingPost$(this.switchingData);

    } else if (this.type === 'DCA') {

      this.recurringSubscriptionArrayData.forEach((dca) => {
        dca.amount = _.toNumber(dca.amount);
      });

      this.recurringSubscriptionData.recurringSubscriptions = this.recurringSubscriptionArrayData;
      console.log('recurringSubscriptionArrayData', this.recurringSubscriptionArrayData);

      req = this.orderService.orderTransactionRecurringSubscriptionPost$(this.recurringSubscriptionData);
    }


    this.saveSub = req.subscribe(res => {
      console.log('saveSub', res);
      this.spinner.hide('global');
      this.toastrService.success('บันทึกข้อมูลเรียบร้อย.');
      this.save.emit();
    }, (error) => {
      this.spinner.hide('global');
      if (error && error.error) {
        const errors = JSON.parse(error.error);
        console.log('errors', errors);
        const findError = _.findIndex(errors, ['status', 'OK']);
        // console.log('findError', findError);
        console.log('switchingData', this.switchingData);
        let orderData;
        if (this.type === 'BUY') {

          orderData = this.subscriptionArrayData;

        } else if (this.type === 'SELL') {
          orderData = this.redemptionArrayData;
        } else if (this.type === 'SWITCH') {
          orderData = this.switchingArrayData;
        } else if (this.type === 'DCA') {
          orderData = this.recurringSubscriptionArrayData;
        }

        console.log('orderData', orderData);
        for (let i = 0; i < errors.length; i++) {
          if (errors[i].status !== 'OK') {
            this.textErrorFailedSave.push(`รายการ ${orderData[i].fundCode} ดำเนินการไม่สำเร็จ ${errors[i].message}`);
          } else {
            this.textSuccessSave.push(`${orderData[i].fundCode}`);
          }
        }

        if (findError > -1) {
          this.toastrService.success(`รายการ ${this.textSuccessSave.join(',')} ดำเนินการสำเร็จ`, '', { disableTimeOut: false, timeOut: 8000, enableHtml: true });
        }
        if (_.isArray(errors)) {
          this.toastrService.error(`${this.textErrorFailedSave.join('</br>')}`, '', { disableTimeOut: false, timeOut: 8000, enableHtml: true });
        }


      }
    });
    //console.log('subscriptionData...save', this.subscriptionData);
    //console.log('redemptionData...save', this.redemptionData);

  }

  onCancel() {
    this.cancel.emit();
  }

  onClickType(event, type) {
    this.submitted = false;
    console.log('type', type);
    this.type = type?.name;
    this.customerData = undefined;
    this.fundPlan = undefined;
    this.fcnAccountId = undefined;

    if (type.name === 'BUY') {
      this.isShowBuy = true;
      this.isShowSell = false;
      this.isShowSwitch = false;
      this.isShowDca = false;
      this.paymentMethod = { id: 1, name: 'ATS_SA' };
    }

    if (type.name === 'SELL') {
      console.log('SELL');
      this.isShowBuy = false;
      this.isShowSell = true;
      this.isShowSwitch = false;
      this.isShowDca = false;
      this.isShowUploadFile = false;
    }

    if (type.name === 'SWITCH') {
      console.log('SWITCH');
      this.isShowBuy = false;
      this.isShowSell = false;
      this.isShowSwitch = true;
      this.isShowDca = false;
      this.isShowUploadFile = false;
    }

    if (type.name === 'DCA') {
      console.log('DCA');
      this.isShowBuy = false;
      this.isShowSell = false;
      this.isShowSwitch = false;
      this.isShowDca = true;
      this.isShowUploadFile = false;
    }

  }


  onChangePaymentMethod(event) {
    console.log('paymentMethod', this.paymentMethod);
    this.isShowBank = false;
    this.isShowUploadFile = false;
    if (event) {
      if (event.name === 'ATS_SA') {
        this.isShowBank = false;
        this.isShowUploadFile = false;
        this.fileCoverPreview = null;
        this.fileCoverFile = null;
        this.fileCoverPreviewName = null;
        this.isErrorUploadFile = false;
      } else {
        this.isShowBank = true;
        this.isShowUploadFile = true;
      }
    }
  }

  onChangeFile(event) {
    this.fileCoverPreview = null;
    this.fileCoverFile = null;
    this.fileCoverPreviewName = null;
    this.isErrorUploadFile = false;
    // console.log('onChangefile', event);
    const fileType = event.target.files[0].type.split('/');
    // console.log('fileType', fileType);
    if (event.target) {
      this.fileCoverFile = event.target.files[0];
      this.fileName = event.target.files[0].name;
      // this.formData.append('slip', this.fileCoverFile, event.target.files[0].name);
      const reader = new FileReader();
      reader.onload = (e) => {
        // this.fileCoverPreview = e.target.result;
        if (fileType[0] === 'image') {
          this.fileCoverPreview = e.target.result;

        } else {
          this.fileCoverPreviewName = event.target.files[0].name;
        }
        this.cdr.markForCheck();

      };
      reader.readAsDataURL(this.fileCoverFile);
      console.log('fileCoverFile', this.fileCoverFile);
    }
  }

  getCustomerDropdown() {
    this.customerService.customerDropdownGet$().subscribe(data => {
      console.log('getCustomerDropdown', data);
      // const fundPlansId = data.fundPlansId;
      this.listsCustomerDropdown = [];
      if (data) {
        data.forEach(c => {
          // ${ c.accountId }
          this.listsCustomerDropdown.push({ id: c.userId, name: `${c.thFirstname} ${c.thLastname}`, vulnerableFlag: c.vulnerableFlag });
        });
      }
    });
  }

  getFundPlan() {
    // this.customerId = 177;
    // this.listsFundPlanDropdown = [];
    this.customerService.customerIdInfoGet$(_.toNumber(this.customerId),
      ['AGENT_PLAN', 'CUSTOMIZED_PLAN']).subscribe(data => {
      // console.log('customerIdInfoGet', data.fundPlans);
      const fundPlansId = data.fundPlans;
      this.listsFundPlanDropdown = [];
      if (fundPlansId) {
        fundPlansId.forEach(p => {
          this.listsFundPlanDropdown.push({ id: p.id, name: `${p.fcnAccountId} - ${p.name}`, fcnAccountId: p.fcnAccountId });
        });
      }

    });
  }

  onChangByFundData(item) {
    // console.log('onChangByFundData', item);

    this.subscriptionArrayData = _.cloneDeep(item);
    for (const subscription of this.subscriptionArrayData) {
      subscription.effectiveDate = moment(subscription.effectiveDate).format('DD/MM/YYYY');
      // subscription.bankCode = 'SCB_CODE';
      // SCB_CODE
      if (_.isUndefined(subscription.amount)) {
        subscription.amount = undefined;
      } else {
        subscription.amount = _.toNumber(subscription.amount);
      }

    }
    // console.log('onChangByFundData.....', this.subscriptionArrayData);
    const sumAmount = _.sumBy(this.subscriptionArrayData, 'amount');
    // console.log('sumAmount', sumAmount);
    this.TotalAmount = sumAmount ? sumAmount : 0.00;
  }

  onChangDcaFundData(item) {
    console.log('onChangDcaFundData...1', item);
    this.recurringSubscriptionArrayData = _.cloneDeep(item);
    console.log('recurringSubscriptionArrayData', this.recurringSubscriptionArrayData);
  }

  onChangSellFundData(item) {
    // console.log('onChangSellFundData...1', item);
    this.redemptionArrayData = _.cloneDeep(item);
    for (const redemption of this.redemptionArrayData) {
      redemption.redemptionType = redemption.typeSell.value;
      redemption.effectiveDate = moment(redemption.effectiveDate).format('DD/MM/YYYY');
      if (_.isNull(redemption.amount)) {
        redemption.amount = null;
      } else {
        if (redemption.redemptionType === 'AMT') {
          redemption.amount = _.toNumber(redemption.amount);
        } else {
          redemption.unit = _.toNumber(redemption.amount);
        }
      }

    }
    // console.log('onChangSellFundData', this.redemptionArrayData);
  }

  onChangSwitchFundData(item) {
    console.log('onChangSwitchFundData...1', item);
    this.switchingArrayData = _.cloneDeep(item);

    for (const switching of this.switchingArrayData) {
      switching.fundCode = switching.fundSWO?.fondSwoCode?.fundCode;
      switching.counterFundCode = switching.fundSWI?.fondSwiCode?.fundCode;
      switching.redemptionType = switching.typeSell.value;
      switching.effectiveDate = moment(switching.effectiveDate).format('DD/MM/YYYY');


      if (_.isNull(switching.amount) || _.isNaN(switching.amount)) {
        switching.amount = null;
      } else {
        if (switching.redemptionType === 'AMT') {
          switching.amount = _.toNumber(switching.amount);
        } else {
          switching.unit = _.toNumber(switching.amount);
        }
      }

    }
    // console.log('onChangSwitchingArrayData', this.switchingArrayData);
  }


}
