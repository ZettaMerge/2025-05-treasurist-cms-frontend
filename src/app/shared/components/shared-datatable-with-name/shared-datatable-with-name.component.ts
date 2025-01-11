import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'shared-datatable-with-name',
  templateUrl: './shared-datatable-with-name.component.html',
  styleUrls: ['./shared-datatable-with-name.component.scss']
})
export class SharedDatatableWithNameComponent implements OnInit {

  @Input() firstName: string;
  @Input() lastName: string;
  @Input() id: string;
  @Input() riskLevel: any;
  @Input() riskLevelOpenAccount: any;

  constructor() { }

  ngOnInit(): void {
  }

}
