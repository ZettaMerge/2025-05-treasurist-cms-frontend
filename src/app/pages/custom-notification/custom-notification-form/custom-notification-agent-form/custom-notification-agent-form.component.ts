import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AgentDTO, CustomNotiSelectedAllAgentDTO} from '@model';
import {BaseFeatureGridComponent} from '@postnerd-core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {AgentService} from '@api';
import * as _ from 'lodash';

interface FilterType {
  search: string;
  team: any;
}

interface PropType extends AgentDTO {
  'user.email'?: string;
  'user.firstName'?: string;
  'user.phoneNumber'?: string;
  'team.name'?: string;
  'agentPortfolio.noOfCustomer'?: number;
  'agentPortfolio.totalPortValue'?: number;
  'isAllow'?: boolean;
}

@Component({
  selector: 'custom-notification-agent-form',
  templateUrl: './custom-notification-agent-form.component.html',
  styleUrls: ['./custom-notification-agent-form.component.scss']
})
export class CustomNotificationAgentFormComponent extends BaseFeatureGridComponent<PropType, any> implements OnInit, OnChanges {

  @ViewChild('nameTpl', {static: true}) nameTpl: TemplateRef<any>;
  @ViewChild('headerCheckboxTpl', {static: true}) headerCheckboxTpl: TemplateRef<any>;
  @ViewChild('checkboxTpl', {static: true}) checkboxTpl: TemplateRef<any>;


  @Input() agentSelectList;
  @Input() agentActionType;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  filter: FilterType = {} as FilterType;
  agentSelectAllByFilter: CustomNotiSelectedAllAgentDTO = {} as CustomNotiSelectedAllAgentDTO;
  dataSub: Subscription;
  sortData: any;
  direction: string;
  selectAll: boolean;
  agentList = [];
  originalAgentSelectList = [];

  allRecordAgent: number;

  selected = [];
  searchDebounce = _.debounce(
    () => {
      this.selectAll = false;
      this.page.page = 1;
      this.getData();
    },
    1000,
    {leading: false, trailing: true}
  );

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private agentService: AgentService,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.agentSelectList && this.agentSelectList.length !== 0) {
      this.originalAgentSelectList = _.cloneDeep(this.agentSelectList);
      this.agentList = this.agentSelectList;
      this.getData();
      this.getAllAgent();
    }
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getData();
    this.getAllAgent();
  }

  filterChange(event) {
    console.log('event', event);
    this.selectAll = false;
    this.page.page = 1;
    this.getData();
  }

  detailInfo(item) {
    const url = `agent/profile/detail/${item.id}`;
    window.open(url, '_blank');
  }

  add() {
    this.router.navigate([`./agent/profile/new`]);
  }

  pageChange() {
    this.selected = [];
    this.selectAll = false;
    this.getData();
  }

  onSortChange(data) {
    this.sortData = data.sortBy;
    this.direction = data.asc ? 'asc' : 'desc';
    console.log('this.sort', this.sortData);
    this.page.page = 1;
    this.getData();
  }

  onClickAll(event) {
    console.log('eventt isss', event);

    if (event && event === true) {

      const selectAllAgent = this.agentService.agentCustomNotiSelectedAllGet$(
        this.filter.search,
        undefined,
        this.filter?.team ? _.map(this.filter?.team, item => item.id) : undefined,
      ).subscribe(selectAllItem => {
        this.agentSelectAllByFilter = selectAllItem;

        if (this.agentSelectAllByFilter) {
          const agentIdArray = [];
          const splitAgentId = this.agentSelectAllByFilter.agentUserIds.split(',');
          splitAgentId.forEach(id => {
            agentIdArray.push({balanceId: id});
          });

          this.agentService.agentListGet$(
            this.sortData,
            this.direction,
            this.filter.search,
            agentIdArray.length,
            1,
            undefined,
            this.filter?.team ? _.map(this.filter?.team, item => item.id) : undefined,
          ).subscribe(agentRows => {
            this.rows = agentRows.agents;

            for (const agentListSelectAll of this.rows) {
              agentListSelectAll.isAllow = true;
              this.agentList.push(agentListSelectAll);
            }
            this.selectAll = _.every(this.rows, 'isAllow');
            this.agentList = _.uniqBy(this.agentList, i => i.user.id);
            console.log(' this.agentList', this.agentList);
          });
        }
      });

    } else {

      const selectAllAgent = this.agentService.agentCustomNotiSelectedAllGet$(
        this.filter.search,
        undefined,
        this.filter?.team ? _.map(this.filter?.team, item => item.id) : undefined,
      ).subscribe(selectAllItem => {
        this.agentSelectAllByFilter = selectAllItem;

        if (this.agentSelectAllByFilter) {
          const agentIdArray = [];
          const splitAgentId = this.agentSelectAllByFilter.agentUserIds.split(',');
          splitAgentId.forEach(id => {
            agentIdArray.push({balanceId: id});
          });

          this.agentService.agentListGet$(
            this.sortData,
            this.direction,
            this.filter.search,
            agentIdArray.length,
            1,
            undefined,
            this.filter?.team ? _.map(this.filter?.team, item => item.id) : undefined,
          ).subscribe(agentRows => {
            this.rows = agentRows.agents;

            for (const agentListSelectAll of this.rows) {
              agentListSelectAll.isAllow = false;

              const findIndex = _.findIndex(this.agentList, i => i.isAllow === agentListSelectAll.isAllow);
              this.agentList.splice(findIndex, 1);
              // this.balanceList.push(balanceListSelectAll);
              console.log(' this.agentList', this.agentList);
            }
          });
        }
      });

      console.log(' this.agentList', this.agentList);
    }
  }


  async onClickCheck(event, item, agentId) {
    if (agentId && item.isAllow === false) {
      const findIndex = _.findIndex(this.agentList, i => i?.user?.id === agentId);
      this.agentList.splice(findIndex, 1);
      this.selectAll = _.every(this.rows, 'isAllow');
      console.log(' this.agentList', this.agentList);
    } else {
      this.agentList.push(item);
      this.selectAll = _.every(this.rows, 'isAllow');
      this.agentList = _.uniqBy(this.agentList, i => i.user.id);
      console.log(' this.agentList', this.agentList);

    }

    console.log('agentList 1 rows', this.agentList);
  }

  getAgentRecord(item) {
    if (item) {
      const allRecord = item.length;
      return allRecord;
    }
  }

  protected setColumns() {
    this.columns = [
      {
        name: '',
        prop: 'id',
        width: 30,
        sortable: false,
        cellTemplate: this.checkboxTpl,
        headerTemplate: this.headerCheckboxTpl,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'ชื่อ-นามสกุล',
        prop: 'user.firstName',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.nameTpl,
        sortBy: 'user.firstName',
      },
      {
        name: 'Team',
        prop: 'team.name',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'team.name',
      },
      {
        name: 'IC License',
        prop: 'icLicense',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'มูลค่าพอร์ตรวม',
        prop: 'agentPortfolio.totalPortValue',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.decimalTpl,
        sortBy: 'agentPortfolio.totalPortValue',
      },
    ];
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
    this.dataSub = this.agentService.agentListGet$(
      this.sortData,
      this.direction,
      this.filter.search,
      this.page.perPage,
      this.page.page,
      undefined,
      this.filter?.team ? _.map(this.filter?.team, item => item.id) : undefined,
    ).subscribe(data => {
      this.rows = data.agents;
      this.page.totalCount = data.pagination.allRecord;

      if (this.agentList.length > 0) {
        console.log('agentList', this.agentList);
        for (const agentSelect of this.agentList) {
          const findIndexSelect = _.findIndex(this.rows, i => i?.user?.id === agentSelect?.user?.id);
          if (findIndexSelect >= 0) {
            this.rows[findIndexSelect].isAllow = true;

            const isAllow = this.rows[findIndexSelect].isAllow;
            const addresses = this.rows[findIndexSelect].addresses;
            const agentPortfolio = this.rows[findIndexSelect].agentPortfolio;
            const bank = this.rows[findIndexSelect].bank;
            const bankAccountNo = this.rows[findIndexSelect].bankAccountNo;
            const birthdate = this.rows[findIndexSelect].birthdate;
            const commissionPercentage = this.rows[findIndexSelect].commissionPercentage;
            const icLicense = this.rows[findIndexSelect].icLicense;
            const id = this.rows[findIndexSelect].id;
            const inactiveDate = this.rows[findIndexSelect].inactiveDate;
            const isTeamLeader = this.rows[findIndexSelect].isTeamLeader;
            const licenseExpireDate = this.rows[findIndexSelect].licenseExpireDate;
            const plainComplexFlag = this.rows[findIndexSelect].plainComplexFlag;
            const team = this.rows[findIndexSelect].team;
            const user = this.rows[findIndexSelect].user;

            if (agentSelect.user.id === user.id) {
              agentSelect.isAllow = isAllow;
              agentSelect.addresses = addresses;
              agentSelect.agentPortfolio = agentPortfolio;
              agentSelect.bank = bank;
              agentSelect.bankAccountNo = bankAccountNo;
              agentSelect.birthdate = birthdate;
              agentSelect.commissionPercentage = commissionPercentage;
              agentSelect.icLicense = icLicense;
              agentSelect.id = id;
              agentSelect.inactiveDate = inactiveDate;
              agentSelect.isTeamLeader = isTeamLeader;
              agentSelect.licenseExpireDate = licenseExpireDate;
              agentSelect.plainComplexFlag = plainComplexFlag;
              agentSelect.team = team;
              agentSelect.user = user;
              console.log('agentSelect.user.id === user.id', agentSelect.id === user.id);
            }
            console.log('agentList', this.agentList);
            //CHECK ALL IS ALLOW IN PER PAGE

            this.selectAll = _.every(this.rows, 'isAllow');
            console.log('this.selectAll', this.selectAll);
          }
        }
      }
      this.spinner.hide('global');
      // console.log('data.totalContent', data);
      // console.log('data.totalContent', data.agents);
    });
  }


  getAllAgent() {
    this.agentService.agentListGet$(
      this.sortData,
      this.direction,
      this.filter.search,
      this.page.perPage,
      this.page.page,
      undefined,
      this.filter?.team ? _.map(this.filter?.team, item => item.id) : undefined,
    ).subscribe( data => {
      this.allRecordAgent = data.pagination.allRecord;
    });
  }

  clearFilter() {
    this.filter = {
      search: undefined,
      team: undefined,
    } as FilterType;
    this.selectAll = false;

    this.page.page = 1;
    this.getData();
  }

  onCancel() {
    this.cancel.emit(this.originalAgentSelectList);
  }

  onSave() {
    this.save.emit(this.agentList);
  }


}
