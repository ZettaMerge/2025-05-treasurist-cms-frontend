import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {BaseFeatureGridComponent, PnStorageService} from '@postnerd-core';
import {ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { AgentDTO } from '@model';
import { NgxSpinnerService } from 'ngx-spinner';
import {AgentService, CheckPermissionService} from '@api';
import {PermissionEnum} from "@app/core/variables/permission.enum";


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
}

@Component({
  selector: 'fe-agent-profile',
  templateUrl: './fe-agent-profile.component.html',
  styleUrls: ['./fe-agent-profile.component.scss']
})
export class FeAgentProfileComponent extends BaseFeatureGridComponent<PropType, any> implements OnInit {

  @ViewChild('nameTpl', { static: true }) nameTpl: TemplateRef<any>;

  canView: boolean;
  canCreate: boolean;


  filter: FilterType = {} as FilterType;
  dataSub: Subscription;
  sortData: any;
  direction: string;

  searchDebounce = _.debounce(
    () => {
      this.page.page = 1;
      this.getData();
    },
    1000,
    { leading: false, trailing: true }
  );

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private agentService: AgentService,
    protected route: ActivatedRoute,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
    super();
  }

  ngOnInit(): void {
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.AgentProfile).then(result => {
      if (result) {
        this.canView = result.canView;
        this.canCreate = result.canCreate;
      }
      console.log('this.canView', this.canView);
      console.log('this.canCreate', this.canCreate);
    });
    super.ngOnInit();
    this.getData();
  }

  filterChange() {
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
        name: 'ชื่อ-นามสกุล',
        prop: 'user.firstName',
        width: 220,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.nameTpl,
        sortBy: 'user.firstName',
      },
      {
        name: 'อีเมล',
        prop: 'user.email',
        width: 200,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'เบอร์โทร',
        prop: 'user.phoneNumber',
        width: 100,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
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
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'ลูกค้าที่ดูแล',
        prop: 'agentPortfolio.noOfCustomer',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'agentPortfolio.noOfCustomer'
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

      {
        name: '', prop: '_action',
        cellTemplate: this.grid.detailTpl,
        width: 80,
        sortable: false,
        canAutoResize: false,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
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
      this.filter?.team?.id || undefined,
    ).subscribe(data => {
      this.rows = data.agents;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
      console.log('data.totalContent', data);
      console.log('data.totalContent', data.agents);
    });
  }

  clearFilter() {
    this.filter = {
      search: undefined,
      team: undefined,
    } as FilterType;

    this.page.page = 1;
    this.getData();
  }

}
