import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseFeatureGridComponent, BaseFeatureTabComponent } from '@postnerd-core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService, TeamService } from '@api';
import { CustomerListDTO } from '@model';
import * as _ from 'lodash';
import { debounce } from 'lodash';

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
}

@Component({
  selector: 'fe-customer-list',
  templateUrl: './fe-customer-list.component.html',
  styleUrls: ['./fe-customer-list.component.scss']
})
export class FeCustomerListComponent extends BaseFeatureGridComponent<CustomerListDTO, any> implements OnInit, OnDestroy {

  @ViewChild('nameTpl', { static: true }) nameTpl: TemplateRef<any>;
  @ViewChild('customerTypeTpl', { static: true }) customerTypeTpl: TemplateRef<any>;
  @ViewChild('portTpl', { static: true }) portTpl: TemplateRef<any>;
  @ViewChild('portCostTpl', { static: true }) portCostTpl: TemplateRef<any>;
  @ViewChild('costTpl', { static: true }) costTpl: TemplateRef<any>;
  @ViewChild('profit', { static: true }) profit: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('fxTpl', { static: true }) fxTpl: TemplateRef<any>;
  @ViewChild('commoTpl', { static: true }) commoTpl: TemplateRef<any>;
  @ViewChild('icLicenseTpl', { static: true }) icLicenseTpl: TemplateRef<any>;

  dataSub: Subscription;

  typeDCAStatus = undefined;
  commo = undefined;
  fx = undefined;
  customerTypeStatus = undefined;
  cdd = undefined;
  risk = undefined;
  customerData: CustomerListDTO = {} as CustomerListDTO;
  filter: FilterType = {
    fx: undefined,
    comMo: undefined,
    cdd: undefined,
  } as FilterType;

  listAssets: any;
  listFunds: any;

  icLicense: string;
  team: string;

  sortData: string;
  direction: string;


  listsCustomerDropdown = [
    { id: 1, name: 'General', value: 'Individual' },
    { id: 2, name: 'Juristic', value: 'Juristic' },
  ];

  listsIcLicenseDropdown = [
    { id: 1, name: 'Vulnerable' },
    { id: 2, name: 'General' },
  ];


  riskList = [
    { value: undefined, label: 'All' },
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
  ];

  typeList = [
    { value: undefined, label: 'All' },
    { value: 1, label: 'ใช่' },
    { value: 0, label: 'ไม่ใช่' }
  ];

  customerType = [
    { value: undefined, label: 'All' },
    { value: 'general', label: 'General Customer' },
    { value: 'vulnerable', label: 'Vulnerable Customer' }
  ];

  cddList = [
    { value: undefined, label: 'All' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
  ];

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService,
    private teamService: TeamService,
  ) {
    super();
    this.searchTextChange = debounce(this.searchTextChange, 1000);
  }

  ngOnInit(): void {
    this.icLicense = this.route.snapshot.paramMap.get('icLicense');
    this.team = this.route.snapshot.paramMap.get('teamId');
    console.log('acc id', this.icLicense);
    if (this.icLicense) {

      // set Filter
      this.filter.searchIC = this.icLicense;
      this.teamService.dropdownTeamGet$().subscribe(data => {
        const findTeam = data.find(t => t.id === _.toNumber(this.team));
        this.filter.searchTeam = findTeam;

      });


      // GET DATA
      super.ngOnInit();
      this.getData();
    } else {
      super.ngOnInit();
      this.getData();
    }

  }

  // getTeamDropdown() {
  //   this.teamService.dropdownTeamGet$().subscribe(data => {
  //     console.log('data', data);
  //     this.teamList = [];
  //     for (const teamDropdown of data) {
  //       this.teamList.push({id: teamDropdown.id, name: teamDropdown.name});
  //     }
  //     console.log('team', this.teamList);
  //   });
  // }

  filterAmcChange(event) {
    console.log('evnt amc', event);
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

    if (event !== null) {
      console.log('evnt fund have', event);
      this.page.page = 1;
      this.getData();
    } else {
      console.log('evnt fund undefinde', event);
      this.filter.fund = undefined;
      this.page.page = 1;
      this.getData();
    }
  }


  filterChange(event) {
    this.page.page = 1;
    this.getData();
  }

  filterTypeCustomerChange() {

  }

  searchTextChange(event: string) {
    this.page.page = 1;
    this.getData();
  }

  onSortChange(data) {
    this.sortData = data.sortBy;
    this.direction = data.asc ? 'asc' : 'desc';
    console.log('this.sort', this.sortData);
    this.page.page = 1;
    this.getData();
  }


  protected setColumns() {
    this.columns = [
      {
        name: 'Account ID',
        prop: 'fcnAccountId',
        width: 200,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.nameTpl,
        sortBy: 'fcnAccountId',
      },
      {
        name: 'IC License',
        prop: 'vulnerableFlag',
        sortable: false,
        width: 120,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.icLicenseTpl,
      },
      {
        name: 'Team',
        prop: 'team',
        sortable: false,
        width: 120,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        // cellTemplate: this.customerTypeTpl,
      },
      {
        name: 'ต้นทุนรวม',
        prop: 'portCost',
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        width: 120,
        cellTemplate: this.portCostTpl,
        sortBy: 'portCost',
        sortable: true,
      },
      {
        name: 'มูลค่ารวม',
        prop: 'portValue',
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'portValue',
        sortable: true,
        width: 120,
        cellTemplate: this.portTpl,
      },
      {
        name: 'กำไร ขาดทุน',
        prop: 'portProfit',
        width: 100,
        cellTemplate: this.profit,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'portProfit',
        sortable: true,
      },
      {
        name: 'Fx',
        prop: 'canAcceptFxRisk',
        sortable: false,
        width: 100,
        cellClass: 'justify-content-center align-items-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.fxTpl,
      },
      {
        name: 'Commo',
        prop: 'comMo',
        sortable: false,
        width: 100,
        cellClass: 'justify-content-center align-items-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.commoTpl,
      },
      {
        name: '', prop: '_action',
        cellTemplate: this.grid.detailTpl,
        minWidth: 80,
        sortable: false,
        canAutoResize: false,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
      },
    ];
  }

  delete(item) {
  }

  detail(item) {
    const url = `customer/list/profile/${item.id}`;
    window.open(url, '_blank');
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    console.log('hello', this.typeDCAStatus);
    this.dataSub = this.customerService.customerListGet$(
      this.filter?.fx === 1 ? 1 : this.filter?.fx === 0 ? 0 : undefined,
      this.filter?.accountType?.value || undefined,
      this.filter?.comMo === 1 ? 1 : this.filter?.comMo === 0 ? 0 : undefined,
      this.filter?.amc?.amcCode || undefined,
      this.filter.cdd || undefined,
      undefined,
      undefined,
      undefined,
      this.filter?.fund?.fundCode || undefined,
      this.page.page,
      this.filter.search || undefined,
      this.page.perPage,
      undefined,
      this.filter.riskLevel || undefined,
      this.filter.searchIC || undefined,
      this.filter?.searchTeam?.id || undefined,
      this.direction,
      this.sortData,
    ).subscribe((data) => {
      this.rows = data.customers;
      this.page.totalCount = data.pagination.allRecord;
      // this.page.page = data.pagination.page;
      this.spinner.hide('global');
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
    } as FilterType;

    this.commo = undefined;
    this.fx = undefined;

    this.page.page = 1;
    this.getData();
  }
}
