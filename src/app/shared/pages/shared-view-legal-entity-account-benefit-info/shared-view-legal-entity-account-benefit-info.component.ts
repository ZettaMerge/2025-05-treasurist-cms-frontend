import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'shared-view-legal-entity-account-benefit-info',
  templateUrl: './shared-view-legal-entity-account-benefit-info.component.html',
  styleUrls: ['./shared-view-legal-entity-account-benefit-info.component.scss']
})
export class SharedViewLegalEntityAccountBenefitInfoComponent implements OnInit {

  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
  }

}
