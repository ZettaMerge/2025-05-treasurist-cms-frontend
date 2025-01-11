import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'shared-view-legal-entity-account-info',
  templateUrl: './shared-view-legal-entity-account-info.component.html',
  styleUrls: ['./shared-view-legal-entity-account-info.component.scss']
})
export class SharedViewLegalEntityAccountInfoComponent implements OnInit {

  @Input() data: any;
  cardExpiredDate;
  birthDate;

  constructor() {
  }

  ngOnInit(): void {

  }

}
