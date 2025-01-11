import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'shared-view-legal-entity-account-terms-sign-transaction',
  templateUrl: './shared-view-legal-entity-account-terms-sign-transaction.component.html',
  styleUrls: ['./shared-view-legal-entity-account-terms-sign-transaction.component.scss']
})
export class SharedViewLegalEntityAccountTermsSignTransactionComponent implements OnInit {

  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
  }

}
