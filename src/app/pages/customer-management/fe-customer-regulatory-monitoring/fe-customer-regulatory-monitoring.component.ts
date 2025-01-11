import {Component, OnInit} from '@angular/core';
import {BaseFeatureTabComponent, PnStorageService} from '@postnerd-core';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {debounce} from 'lodash';
import {PermissionEnum} from "@app/core/variables/permission.enum";
import {CheckPermissionService} from "@api";

enum Tab {
  cdd = 1,
  pep = 2,
  amlo = 3,
}

@Component({
  selector: 'fe-customer-regulatory-monitoring',
  templateUrl: './fe-customer-regulatory-monitoring.component.html',
  styleUrls: ['./fe-customer-regulatory-monitoring.component.scss']
})
export class FeCustomerRegulatoryMonitoringComponent extends BaseFeatureTabComponent implements OnInit {

  canView: boolean;
  canCreate: boolean;
  filterSearch: string;
  search: string;
  filterCode: any;
  filterStatus = undefined;
  Tab = Tab;

  tabs = [
    {name: 'CDD Checklist', id: Tab.cdd},
    {name: 'PEP List', id: Tab.pep},
    {name: 'AMLO', id: Tab.amlo},
  ];

  codeList = [
    {id: 1, name: 'HR-02'},
    {id: 2, name: 'RH-08-RISK'},
  ];

  statusList = [
    {value: undefined, label: 'All'},
    {value: true, label: 'Active'},
    {value: false, label: 'Inactive'}
  ];

  constructor(
    protected route: ActivatedRoute,
    private router: Router,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
    super(route);
    this.searchTextChange = debounce(this.searchTextChange, 1000);
  }

  ngOnInit(): void {
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.CustomerRegulatoryMonitoring).then(result => {
      if (result) {
        this.canView = result.canView;
        this.canCreate = result.canCreate;
      }
      console.log('this.canView', this.canView);
      console.log('this.canCreate', this.canCreate);
    });
  }

  searchTextChange(event: string) {
    this.search = event;
    console.log('searchTextChange', event);
    console.log('event', event);
  }

  clearFilter() {
    this.filterSearch = '';
    this.search = undefined;
    this.filterCode = undefined;
    this.filterStatus = undefined;
  }

  onChange(e) {
    console.log('filterCode', this.filterCode);
  }

  onStatusChange(event) {
    this.filterStatus = event;
  }

}
