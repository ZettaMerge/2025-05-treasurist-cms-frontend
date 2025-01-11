import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BaseFeatureGridComponent, BaseFeatureTabComponent } from '@postnerd-core';
import { Subscription } from 'rxjs';
import { ContentDTO } from '@model';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { ContentService } from '@api';

interface FilterType {
  version: any;
}

enum Tab {
  listVersion = 1,
  lisCustomer = 2,
}

@Component({
  selector: 'fe-terms-condition',
  templateUrl: './fe-terms-condition.component.html',
  styleUrls: ['./fe-terms-condition.component.scss']
})
export class FeTermsConditionComponent extends BaseFeatureTabComponent implements OnInit {

  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;

  Tab = Tab;

  tabs = [
    { name: 'รายการเวอร์ชัน', id: Tab.listVersion },
    { name: 'รายชื่อลูกค้าที่กดยอมรับ', id: Tab.lisCustomer },
  ];

  dataSub: Subscription;
  filter: FilterType = {} as FilterType;

  constructor(
    private router: Router,
    private contentService: ContentService,
    private spinner: NgxSpinnerService,
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
