import {Component, OnInit, TemplateRef, ViewChild, Input} from '@angular/core';
import {BaseFeatureGridComponent} from '@postnerd-core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {AgentService, CustomNotificationsService} from '@api';
import {AgentDTO, CustomNotiAgentHistory} from '@model';
import * as _ from 'lodash';

interface PropType extends AgentDTO {
  'user.email'?: string;
  'user.firstName'?: string;
  'user.phoneNumber'?: string;
  'team.name'?: string;
  'agentPortfolio.noOfCustomer'?: number;
  'agentPortfolio.totalPortValue'?: number;
}

@Component({
  selector: 'custom-notification-agent-detail',
  templateUrl: './custom-notification-agent-detail.component.html',
  styleUrls: ['./custom-notification-agent-detail.component.scss']
})
export class CustomNotificationAgentDetailComponent extends BaseFeatureGridComponent<CustomNotiAgentHistory, any> implements OnInit {

  @ViewChild('nameTpl', { static: true }) nameTpl: TemplateRef<any>;
  @Input() customNotificationId;


  dataSub: Subscription;
  sortData: any;
  direction: string;


  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private customNotificationsService: CustomNotificationsService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
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
        name: 'ชื่อ-นามสกุล',
        prop: 'agentName',
        width: 220,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'agentName',
      },
      {
        name: 'IC License',
        prop: 'icLicense',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'icLicense',
      },
      {
        name: 'Team',
        prop: 'teamName',
        width: 100,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        sortBy: 'teamName',
      },
      {
        name: 'มูลค่าพอร์ตรวม',
        prop: 'totalPortValue',
        width: 150,
        sortable: true,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.decimalTpl,
        sortBy: 'totalPortValue',
      },
    ];
  }

  protected getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
    this.dataSub = this.customNotificationsService.customNotificationsAgentHistoryByIdGet$(
      this.sortData,
      _.toNumber(this.customNotificationId),
      this.direction,
      this.page.perPage,
      this.page.page,
    ).subscribe(data => {
      this.rows = data.customNotiAgentHistories;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
      console.log('this.rows', this.rows);
    //   console.log('data.totalContent', data.agents);
    });
  }

}
