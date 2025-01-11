import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFeatureGridComponent, BaseFeatureTabComponent } from '@postnerd-core';
import { Subscription } from 'rxjs';
import { ContentService } from '@api';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';

interface FilterType {
  version: any;
}
enum Tab {
  listVersion = 1,
  lisCustomer = 2,
}
@Component({
  selector: 'fe-pdpa',
  templateUrl: './fe-pdpa.component.html',
  styleUrls: ['./fe-pdpa.component.scss']
})
export class FePDPAComponent extends BaseFeatureTabComponent implements OnInit {
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;
  dataSub: Subscription;
  filter: FilterType = {} as FilterType;


  Tab = Tab;

  tabs = [
    { name: 'รายการเวอร์ชัน', id: Tab.listVersion },
    { name: 'รายชื่อลูกค้าที่กดยอมรับ', id: Tab.lisCustomer },
  ];

  constructor(
    private router: Router,
    private pdpaService: ContentService,
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
