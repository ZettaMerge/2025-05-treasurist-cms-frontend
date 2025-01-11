import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'shared-view-legal-entity-account-address',
  templateUrl: './shared-view-legal-entity-account-address.component.html',
  styleUrls: ['./shared-view-legal-entity-account-address.component.scss']
})
export class SharedViewLegalEntityAccountAddressComponent implements OnInit {

  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
  }

}
