import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseFeatureTabComponent } from '@postnerd-core';

enum Tab {
  all = 1,
  regulatoryMonitoring = 2,
}

@Component({
  selector: 'v-tab',
  templateUrl: './v-tab.component.html',
  styleUrls: ['./v-tab.component.scss']
})
export class VTabComponent extends BaseFeatureTabComponent implements OnInit {

  Tab = Tab;
  tabs = [
    { name: 'ทั้งหมด', id: Tab.all },
    { name: 'Regulatory Monitoring', id: Tab.regulatoryMonitoring },
  ];

  constructor(
    protected route: ActivatedRoute,
  ) {
    super(route);
  }

  ngOnInit(): void {
  }

}
