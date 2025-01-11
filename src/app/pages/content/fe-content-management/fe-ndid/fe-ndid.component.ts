import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BaseFeatureGridComponent, BaseFeatureTabComponent } from '@postnerd-core';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContentService } from '@api';
import { ContentDTO } from '@model';
import * as _ from 'lodash';
import { threadId } from 'worker_threads';
interface FilterType {
  version: any;
}

enum Tab {
  listVersion = 1,
  lisCustomer = 2,
}
@Component({
  selector: 'fe-ndid',
  templateUrl: './fe-ndid.component.html',
  styleUrls: ['./fe-ndid.component.scss']
})
export class FeNdidComponent extends BaseFeatureTabComponent implements OnInit {

  Tab = Tab;

  tabs = [
    { name: 'รายการเวอร์ชัน', id: Tab.listVersion },
    { name: 'รายชื่อลูกค้าที่กดยอมรับ', id: Tab.lisCustomer },
  ];


  filter: FilterType = {} as FilterType;
  ndid: ContentDTO = {} as ContentDTO;

  versionDropdown: any;
  dataSub: Subscription;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private ndidService: ContentService,
    protected route: ActivatedRoute,
  ) {
    super(route);
  }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate([`./content-management`]);
  }

}
