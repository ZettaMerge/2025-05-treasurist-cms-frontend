import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'shared-datatable-transaction-date',
  templateUrl: './shared-datatable-transaction-date.component.html',
  styleUrls: ['./shared-datatable-transaction-date.component.scss']
})
export class SharedDatatableTransactionDateComponent implements OnInit {

  @Input() createDate;
  @Input() updateDate;

  constructor() { }

  ngOnInit(): void {
  }

}
