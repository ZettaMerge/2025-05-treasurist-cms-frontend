import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'shared-datatable-port',
  templateUrl: './shared-datatable-port.component.html',
  styleUrls: ['./shared-datatable-port.component.scss']
})
export class SharedDatatablePortComponent implements OnInit {

  @Input() portValue: any;
  @Input() upDateAt: any;
  @Input() portCost: any;

  constructor() { }

  ngOnInit(): void {
  }

}
