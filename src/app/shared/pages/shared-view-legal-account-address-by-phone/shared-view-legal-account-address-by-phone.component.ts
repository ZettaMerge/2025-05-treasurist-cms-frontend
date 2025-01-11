import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'shared-view-legal-account-address-by-phone',
  templateUrl: './shared-view-legal-account-address-by-phone.component.html',
  styleUrls: ['./shared-view-legal-account-address-by-phone.component.scss']
})
export class SharedViewLegalAccountAddressByPhoneComponent implements OnInit {

  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
  }

}
