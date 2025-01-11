import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  Input,
  OnChanges, SimpleChanges
} from '@angular/core';
import * as _ from 'lodash';
import {debounce} from 'lodash';
import {BaseFeatureGridComponent, PnStorageService} from '@postnerd-core';
import {CustomerListDTO, CustomNotiSelectedAllCusDTO, UserBalanceDTO} from '@model';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerService} from '@api';
import {Subscription} from 'rxjs';
import {SelectionType} from '@swimlane/ngx-datatable';

interface FilterType {
  search: string;
  searchIC: string;
  accountType: any;
  amc: any;
  fund: any;
  fx: any;
  comMo: any;
  icLicense: any;
  riskLevel: any;
  cdd: any;
  searchTeam: any;
  profit: any;
  high: number;
  low: number;
}

interface PropType extends UserBalanceDTO {
  'isAllow'?: boolean;
}

@Component({
  selector: 'custom-notification-customer-form',
  templateUrl: './custom-notification-customer-form.component.html',
  styleUrls: ['./custom-notification-customer-form.component.scss']
})
export class CustomNotificationCustomerFormComponent extends BaseFeatureGridComponent<PropType, any> implements OnInit, OnDestroy, OnChanges {

  @Input() balanceSelectList;
  @Input() userIdSelectList;
  @Input() customerActionType;
  @Output() save = new EventEmitter();
  @Output() saveUser = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() cancelUser = new EventEmitter();

  @ViewChild('nameTpl', {static: true}) nameTpl: TemplateRef<any>;
  @ViewChild('portTpl', {static: true}) portTpl: TemplateRef<any>;
  @ViewChild('portCostTpl', {static: true}) portCostTpl: TemplateRef<any>;
  @ViewChild('costTpl', {static: true}) costTpl: TemplateRef<any>;
  @ViewChild('profit', {static: true}) profit: TemplateRef<any>;
  @ViewChild('fundTpl', {static: true}) fundTpl: TemplateRef<any>;
  @ViewChild('headerCheckboxTpl', {static: true}) headerCheckboxTpl: TemplateRef<any>;
  @ViewChild('checkboxTpl', {static: true}) checkboxTpl: TemplateRef<any>;

  filter: FilterType = {
    fx: undefined,
    comMo: undefined,
    cdd: undefined,
    profit: 1,
  } as FilterType;

  totalCustomerRecord: number;
  filterFundList: any;
  selectAll: boolean;

  allRecordCustomer: number;

  dataSub: Subscription;
  customerSelectAllByFilter: CustomNotiSelectedAllCusDTO = {} as CustomNotiSelectedAllCusDTO;

  selected = [];
  userList = [];
  balanceList: PropType[] = [];
  customerUserIdList = [];
  originalBalanceSelectList = [];
  originalUserSelectList = [];
  balanceIdList = [];
  selectionType = SelectionType;

  typeDCAStatus = undefined;
  commo = undefined;
  fx = undefined;
  customerTypeStatus = undefined;
  cdd = undefined;
  risk = undefined;

  sortData = 'customerName';
  direction = 'asc';

  recordSelect: number;

  listsCustomerDropdown = [
    {id: 1, name: 'General', value: 'Individual'},
    {id: 2, name: 'Juristic', value: 'Juristic'},
  ];

  riskList = [
    {value: undefined, label: 'All'},
    {value: 1, label: 1},
    {value: 2, label: 2},
    {value: 3, label: 3},
    {value: 4, label: 4},
    {value: 5, label: 5},
  ];

  typeList = [
    {value: undefined, label: 'All'},
    {value: 1, label: 'ใช่'},
    {value: 0, label: 'ไม่ใช่'}
  ];

  customerType = [
    {value: undefined, label: 'All'},
    {value: 'general', label: 'General Customer'},
    {value: 'vulnerable', label: 'Vulnerable Customer'}
  ];

  cddList = [
    {value: undefined, label: 'All'},
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
  ];

  profitList = [
    {value: 1, label: 'บาท'},
    {value: 0, label: '%'}
  ];


  constructor(
    private spinner: NgxSpinnerService,
    private customerService: CustomerService,
    protected storage: PnStorageService,
  ) {
    super();
    this.searchTextChange = debounce(this.searchTextChange, 1000);
    this.filterChangeHigh = debounce(this.filterChangeHigh, 1000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.balanceSelectList && this.balanceSelectList.length !== 0) {
      this.originalBalanceSelectList = _.cloneDeep(this.userIdSelectList);
      this.originalUserSelectList = _.cloneDeep(this.balanceSelectList);
      // SET USERID
      this.userList = this.userIdSelectList;
      // SET DATA IN BALANCELIST
      for (const balanceId of this.balanceSelectList) {
        this.balanceList.push(
          {
            balanceId: balanceId.balanceId,
            amcCode: null,
            amount: null,
            cost: null,
            customerName: null,
            fundCode: null,
            profit: null,
            profitPercent: null,
            riskLevel: null,
            userId: null,
            fundRiskLevel: null,
          }
        );
      }

      super.ngOnInit();
      this.getData();
      this.getRecordItem();
    } else {
      this.originalBalanceSelectList = _.cloneDeep(this.userIdSelectList);
      this.originalUserSelectList = _.cloneDeep(this.balanceSelectList);
      // SET USERID
      this.userList = this.userIdSelectList;

      // SET DATA IN BALANCELIST
      for (const balanceId of this.balanceSelectList) {
        this.balanceList.push(
          {
            balanceId: balanceId.balanceId,
            amcCode: null,
            amount: null,
            cost: null,
            customerName: null,
            fundCode: null,
            profit: null,
            profitPercent: null,
            riskLevel: null,
            userId: null,
            fundRiskLevel: null,
          }
        );
      }
      super.ngOnInit();
      this.getData();
      this.getRecordItem();
    }
  }

  ngOnInit(): void {
    // super.ngOnInit();
    // this.getData();
    // this.getRecordItems();
  }

  onSave() {
    console.log('rows', this.rows);
    if (this.balanceList && this.balanceList.length !== 0) {
      this.save.emit(this.balanceList);
      this.saveUser.emit(this.userList);
    } else {
      this.save.emit(this.balanceList);
      this.saveUser.emit(this.userList);
    }

  }

  filterAmcChange(event) {
    this.selectAll = false;
    if (event !== null) {
      this.page.page = 1;
      this.getData();
    } else {
      this.filter.fund = undefined;
      this.page.page = 1;
      this.getData();
    }
  }

  filterFundChange(event) {
    console.log('evnt fund', event);
    this.selectAll = false;

    if (event !== null) {
      this.page.page = 1;
      this.getData();
    } else {
      this.filter.fund = undefined;
      this.page.page = 1;
      this.getData();
    }
  }

  filterChange(event) {
    this.selectAll = false;
    this.page.page = 1;
    this.getData();
  }

  onChangeProfit(event) {

    this.selectAll = false;
    if (event === 0) {
      this.filter.low = undefined;
      this.filter.high = undefined;
      this.page.page = 1;
      this.getData();
    } else {
      this.filter.low = undefined;
      this.filter.high = undefined;
      this.page.page = 1;
      this.getData();
    }
  }

  filterChangeLow(event) {
    this.selectAll = false;
    this.page.page = 1;
    this.getData();
  }

  onsetDecimal(item, type) {
    if (item && type === 'low') {
      this.filter.low = item.toFixed(2);
    } else if (item && type === 'high') {
      this.filter.high = item.toFixed(2);
    }
  }

  filterChangeHigh(event) {
    this.selectAll = false;
    this.page.page = 1;
    this.getData();
  }

  searchTextChange(event: string) {
    this.selectAll = false;
    this.page.page = 1;
    this.getData();
  }

  onSortChange(data) {

    if (data.sortBy !== 'portProfit') {
      this.sortData = data.sortBy;
      this.direction = data.asc ? 'asc' : 'desc';
      console.log('this.sort', this.sortData);
      this.page.page = 1;
      this.getData();
    } else {
      this.sortData = this.filter.profit === 1 ? data.sortBy : 'profitPercent';
      this.direction = data.asc ? 'asc' : 'desc';
      console.log('this.sort', this.sortData);
      this.page.page = 1;
      this.getData();
    }
  }

  pageChange() {
    this.selected = [];
    this.selectAll = false;
    this.getData();
  }

  onClickAll(event) {
    this.spinner.show('global');

    if (event && event === true) {
      console.log('select all == true');
      this.customerService.customerSelectAllUserBalanceGet$(
        this.filter?.fx === 1 ? 1 : this.filter?.fx === 0 ? 0 : undefined,
        this.filter?.accountType ? _.map(this.filter?.accountType, item => item.value) : undefined,
        this.filter?.amc ? _.map(this.filter?.amc, item => item.amcCode) : undefined,
        this.filter.cdd || undefined,
        this.filter?.comMo === 1 ? 1 : this.filter?.comMo === 0 ? 0 : undefined,
        this.filter?.searchIC ? _.map(this.filter?.searchIC, item => item) : undefined,
        this.filter.profit === 1 && this.filter?.high ? this.filter?.high : undefined,
        this.filter.profit === 1 && this.filter?.low ? this.filter?.low : undefined,
        this.filter.profit === 0 && this.filter?.high ? this.filter?.high : undefined,
        this.filter.profit === 0 && this.filter?.low ? this.filter?.low : undefined,
        this.filter.riskLevel || undefined,
        this.filter.search || undefined,
        this.filter?.searchTeam ? _.map(this.filter?.searchTeam, item => item.id) : undefined,
        this.filter?.fund ? _.map(this.filter?.fund, item => item.fundCode) : undefined
      )
        .subscribe(selectAllData => {
          this.customerSelectAllByFilter = selectAllData;
          this.balanceList = _.uniqBy(this.balanceList, 'balanceId');
          console.log('customerSelectAllByFilter', this.customerSelectAllByFilter);

          if (this.customerSelectAllByFilter) {
            const balanceIdArray = [];
            const splitBalanceId = this.customerSelectAllByFilter.balanceIds.split(',');
            splitBalanceId.forEach(id => {
              balanceIdArray.push({balanceId: id});
            });

            const splitUserId = this.customerSelectAllByFilter.customerUserIds.split(',');
            splitUserId.forEach(id => {
              this.userList.push({userId: id});
            });

            this.userList = _.uniqBy(this.userList, 'userId');


            this.customerService.customerUserBalanceGet$(
              1,
              balanceIdArray.length,
              this.filter?.fx === 1 ? 1 : this.filter?.fx === 0 ? 0 : undefined,
              this.filter?.accountType ? _.map(this.filter?.accountType, item => item.value) : undefined,
              this.filter?.amc ? _.map(this.filter?.amc, item => item.amcCode) : undefined,
              this.filter.cdd || undefined,
              this.sortData,
              this.filter?.comMo === 1 ? 1 : this.filter?.comMo === 0 ? 0 : undefined,
              this.direction,
              this.filter?.searchIC ? _.map(this.filter?.searchIC, item => item) : undefined,
              this.filter.profit === 1 && this.filter?.high ? this.filter?.high : undefined,
              this.filter.profit === 1 && this.filter?.low ? this.filter?.low : undefined,
              this.filter.profit === 0 && this.filter?.high ? this.filter?.high : undefined,
              this.filter.profit === 0 && this.filter?.low ? this.filter?.low : undefined,
              this.filter.riskLevel || undefined,
              this.filter.search || undefined,
              this.filter?.searchTeam ? _.map(this.filter?.searchTeam, item => item.id) : undefined,
              this.filter?.fund ? _.map(this.filter?.fund, item => item.fundCode) : undefined
            ).subscribe(balanceRows => {
              this.rows = balanceRows.userBalances;
              console.log('rowss 388', this.rows);

              if (this.rows) {
                for (const balanceListSelectAll of this.rows) {
                  balanceListSelectAll.isAllow = true;
                  console.log('balanceListSelectAll', balanceListSelectAll);
                  this.balanceList.push(balanceListSelectAll);
                }
                // SELECT ALL BY filter
                console.log('this.balanceList', this.balanceList);
                console.log('this.balanceList.length', this.balanceList.length);
                this.selectAll = _.every(this.rows, 'isAllow');
                this.balanceList = _.uniqBy(this.balanceList, 'balanceId');
                console.log('this.balanceList', this.balanceList);
                this.spinner.hide('global');
              }
            });
          }
        });


    } else {

      console.log('select all == false');
      this.customerService.customerSelectAllUserBalanceGet$(
        this.filter?.fx === 1 ? 1 : this.filter?.fx === 0 ? 0 : undefined,
        this.filter?.accountType ? _.map(this.filter?.accountType, item => item.value) : undefined,
        this.filter?.amc ? _.map(this.filter?.amc, item => item.amcCode) : undefined,
        this.filter.cdd || undefined,
        this.filter?.comMo === 1 ? 1 : this.filter?.comMo === 0 ? 0 : undefined,
        this.filter?.searchIC ? _.map(this.filter?.searchIC, item => item) : undefined,
        this.filter.profit === 1 && this.filter?.high ? this.filter?.high : undefined,
        this.filter.profit === 1 && this.filter?.low ? this.filter?.low : undefined,
        this.filter.profit === 0 && this.filter?.high ? this.filter?.high : undefined,
        this.filter.profit === 0 && this.filter?.low ? this.filter?.low : undefined,
        this.filter.riskLevel || undefined,
        this.filter.search || undefined,
        this.filter?.searchTeam ? _.map(this.filter?.searchTeam, item => item.id) : undefined,
        this.filter?.fund ? _.map(this.filter?.fund, item => item.fundCode) : undefined
      )
        .subscribe(selectAllData => {
          this.customerSelectAllByFilter = selectAllData;

          if (this.customerSelectAllByFilter) {
            const balanceIdArray = [];
            const splitBalanceId = this.customerSelectAllByFilter.balanceIds.split(',');
            splitBalanceId.forEach(id => {
              balanceIdArray.push({balanceId: id});
            });
            console.log('balanceIdArray', balanceIdArray.length);

            this.userList = [];

            console.log('this.userList', this.userList);

            this.customerService.customerUserBalanceGet$(
              1,
              balanceIdArray.length,
              this.filter?.fx === 1 ? 1 : this.filter?.fx === 0 ? 0 : undefined,
              this.filter?.accountType ? _.map(this.filter?.accountType, item => item.value) : undefined,
              this.filter?.amc ? _.map(this.filter?.amc, item => item.amcCode) : undefined,
              this.filter.cdd || undefined,
              this.sortData,
              this.filter?.comMo === 1 ? 1 : this.filter?.comMo === 0 ? 0 : undefined,
              this.direction,
              this.filter?.searchIC ? _.map(this.filter?.searchIC, item => item) : undefined,
              this.filter.profit === 1 && this.filter?.high ? this.filter?.high : undefined,
              this.filter.profit === 1 && this.filter?.low ? this.filter?.low : undefined,
              this.filter.profit === 0 && this.filter?.high ? this.filter?.high : undefined,
              this.filter.profit === 0 && this.filter?.low ? this.filter?.low : undefined,
              this.filter.riskLevel || undefined,
              this.filter.search || undefined,
              this.filter?.searchTeam ? _.map(this.filter?.searchTeam, item => item.id) : undefined,
              this.filter?.fund ? _.map(this.filter?.fund, item => item.fundCode) : undefined
            ).subscribe(balanceRows => {
              this.rows = balanceRows.userBalances;

              for (const balanceListSelectAll of this.rows) {
                balanceListSelectAll.isAllow = false;

                const findIndex = _.findIndex(this.balanceList, i => i.balanceId === balanceListSelectAll.balanceId);
                this.balanceList.splice(findIndex, 1);
                // this.balanceList.push(balanceListSelectAll);
                console.log(' this.balanceList', this.balanceList);
              }
              console.log(' this.balanceListsss', this.balanceList);
              this.balanceList = _.uniqBy(this.balanceList, 'balanceId');
              this.spinner.hide('global');
            });
          }
        });
    }
  }

  onClickCheck(event, item, balanceId) {
    console.log('log by 1');
    if (balanceId && item.isAllow === false) {
      const findIndex = _.findIndex(this.balanceList, i => i.balanceId === balanceId);
      const findUserIdIndex = _.findIndex(this.userList, i => i.userId === item.userId);
      this.balanceList.splice(findIndex, 1);

      if (this.userList[findUserIdIndex].userId === item.userId && findUserIdIndex >= 0) {
        this.userList.splice(findUserIdIndex, 1);
      }
      this.selectAll = _.every(this.rows, 'isAllow');
      this.balanceList = _.uniqBy(this.balanceList, 'balanceId');
    } else {
      this.balanceList.push(item);
      this.selectAll = _.every(this.rows, 'isAllow');
      this.balanceList = _.uniqBy(this.balanceList, 'balanceId');
      this.userList = _.uniqBy(this.userList, 'userId');
    }
  }

  getCustomerRecord(item) {
    if (item) {
      const allRecord = item.length;
      return allRecord;
    }
  }

  protected setColumns() {
    this.columns = [
      {
        name: '',
        prop: 'userId',
        width: 120,
        sortable: false,
        cellTemplate: this.checkboxTpl,
        headerTemplate: this.headerCheckboxTpl,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'ชื่อ-นามสกุล',
        prop: 'customerName',
        width: 200,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.nameTpl,
        sortBy: 'customerName',
      },
      {
        name: 'กองทุน',
        prop: 'fundCode',
        sortable: true,
        width: 120,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.fundTpl,
      },
      {
        name: 'ต้นทุนรวม',
        prop: 'cost',
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        width: 120,
        cellTemplate: this.portCostTpl,
        sortBy: 'cost',
        sortable: true,
      },
      {
        name: 'มูลค่ารวม',
        prop: 'amount',
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'amount',
        sortable: true,
        width: 120,
        cellTemplate: this.portTpl,
      },
      {
        name: 'กำไร ขาดทุน',
        prop: 'profit',
        width: 100,
        cellTemplate: this.profit,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'profit',
        sortable: true,
      },
    ];
  }

  protected getData() {
    this.spinner.show('global');

    // this.selectAll = false;
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.customerService.customerUserBalanceGet$(
      this.page.page,
      this.page.perPage,
      this.filter?.fx === 1 ? 1 : this.filter?.fx === 0 ? 0 : undefined,
      this.filter?.accountType ? _.map(this.filter?.accountType, item => item.value) : undefined,
      this.filter?.amc ? _.map(this.filter?.amc, item => item.amcCode) : undefined,
      this.filter.cdd || undefined,
      this.sortData,
      this.filter?.comMo === 1 ? 1 : this.filter?.comMo === 0 ? 0 : undefined,
      this.direction,
      this.filter?.searchIC ? _.map(this.filter?.searchIC, item => item) : undefined,
      this.filter.profit === 1 && this.filter?.high ? this.filter?.high : undefined,
      this.filter.profit === 1 && this.filter?.low ? this.filter?.low : undefined,
      this.filter.profit === 0 && this.filter?.high ? this.filter?.high : undefined,
      this.filter.profit === 0 && this.filter?.low ? this.filter?.low : undefined,
      this.filter.riskLevel || undefined,
      this.filter.search || undefined,
      this.filter?.searchTeam ? _.map(this.filter?.searchTeam, item => item.id) : undefined,
      this.filter?.fund ? _.map(this.filter?.fund, item => item.fundCode) : undefined
    ).subscribe((data) => {
      this.rows = data.userBalances;
      this.page.totalCount = data.pagination.allRecord;

      console.log('balanceList', this.balanceList);

      if (this.balanceList.length > 0) {
        for (const balanceSelect of this.balanceList) {
          const findIndexSelect = _.findIndex(this.rows, i => i.balanceId === balanceSelect.balanceId);
          const finOwnIndex = _.findIndex(this.balanceList, i => i.balanceId === balanceSelect.balanceId);
          if (findIndexSelect >= 0) {
            this.rows[findIndexSelect].isAllow = true;
            const balanceId = this.rows[findIndexSelect].balanceId;

            if (balanceSelect.balanceId === balanceId) {
              this.balanceList[finOwnIndex].isAllow = true;
              this.balanceList[finOwnIndex].userId = this.rows[findIndexSelect].userId;
              this.balanceList[finOwnIndex].amcCode = this.rows[findIndexSelect].amcCode;
              this.balanceList[finOwnIndex].amount = this.rows[findIndexSelect].amount;
              this.balanceList[finOwnIndex].cost = this.rows[findIndexSelect].cost;
              this.balanceList[finOwnIndex].customerName = this.rows[findIndexSelect].customerName;
              this.balanceList[finOwnIndex].fundCode = this.rows[findIndexSelect].fundCode;
              this.balanceList[finOwnIndex].profit = this.rows[findIndexSelect].profit;
              this.balanceList[finOwnIndex].profitPercent = this.rows[findIndexSelect].profit;
              this.balanceList[finOwnIndex].riskLevel = this.rows[findIndexSelect].riskLevel;
              this.balanceList[finOwnIndex].fundRiskLevel = this.rows[findIndexSelect].fundRiskLevel;
            }

            //CHECK ALL IS ALLOW IN PER PAGE

            console.log('this.selectAll', this.selectAll);
            console.log('this.balanceList', this.balanceList);
          }
        }

        // this.onClickAll(this.balanceList);

        console.log('customerUserIdList', this.customerUserIdList);
        console.log('balanceList', this.balanceList);
        console.log('userList', this.userList);
        this.selectAll = _.every(this.rows, 'isAllow');
        this.balanceList = _.uniqBy(this.balanceList, 'balanceId');
        console.log('this.selectAll', this.selectAll);
      }
      this.spinner.hide('global');
    });
  }

  getRecordItem() {
    this.customerService.customerUserBalanceGet$(
      this.page.page,
      this.page.perPage,
      this.filter?.fx === 1 ? 1 : this.filter?.fx === 0 ? 0 : undefined,
      this.filter?.accountType ? _.map(this.filter?.accountType, item => item.value) : undefined,
      this.filter?.amc ? _.map(this.filter?.amc, item => item.amcCode) : undefined,
      this.filter.cdd || undefined,
      this.sortData,
      this.filter?.comMo === 1 ? 1 : this.filter?.comMo === 0 ? 0 : undefined,
      this.direction,
      this.filter?.searchIC ? _.map(this.filter?.searchIC, item => item) : undefined,
      this.filter.profit === 1 && this.filter?.high ? this.filter?.high : undefined,
      this.filter.profit === 1 && this.filter?.low ? this.filter?.low : undefined,
      this.filter.profit === 0 && this.filter?.high ? this.filter?.high : undefined,
      this.filter.profit === 0 && this.filter?.low ? this.filter?.low : undefined,
      this.filter.riskLevel || undefined,
      this.filter.search || undefined,
      this.filter?.searchTeam ? _.map(this.filter?.searchTeam, item => item.id) : undefined,
      this.filter?.fund ? _.map(this.filter?.fund, item => item.fundCode) : undefined
    ).subscribe(data => {
      this.allRecordCustomer = data.pagination.allRecord;
    });
  }

  clearFilter() {
    this.filter = {
      search: undefined,
      searchIC: undefined,
      accountType: undefined,
      amc: undefined,
      fund: undefined,
      fx: undefined,
      comMo: undefined,
      icLicense: undefined,
      riskLevel: undefined,
      cdd: undefined,
      searchTeam: undefined,
      profit: 1,
      high: undefined,
      low: undefined,
    } as FilterType;

    this.commo = undefined;
    this.fx = undefined;
    this.filterFundList = undefined;

    this.selectAll = false;
    this.page.page = 1;
    this.getData();
  }

  onCancel() {
    this.cancel.emit(this.originalBalanceSelectList);
    this.cancelUser.emit(this.originalUserSelectList);
  }

  convertString(item) {
    const convertString = _.toString(item);
    return convertString;
  }

}
