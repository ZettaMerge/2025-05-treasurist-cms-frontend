import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'shared-datatable-status',
  templateUrl: './shared-datatable-status.component.html',
  styleUrls: ['./shared-datatable-status.component.scss']
})
export class SharedDatatableStatusComponent implements OnInit {

  @Input() status;
  constructor() { }

  ngOnInit(): void {
  }

}
