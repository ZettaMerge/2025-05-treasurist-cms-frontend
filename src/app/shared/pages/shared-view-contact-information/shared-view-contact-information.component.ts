import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'shared-view-contact-information',
  templateUrl: './shared-view-contact-information.component.html',
  styleUrls: ['./shared-view-contact-information.component.scss']
})
export class SharedViewContactInformationComponent implements OnInit {

  @Input() data: any;
  @Input() address: any;
  constructor() { }

  ngOnInit(): void {
  }

}
