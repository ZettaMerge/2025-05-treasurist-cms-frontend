import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'shared-address',
  templateUrl: './shared-address.component.html',
  styleUrls: ['./shared-address.component.scss']
})
export class SharedAddressComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit(): void {
  }

}
