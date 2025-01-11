import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Page } from '../pn-grid.component';

@Component({
  selector: 'pn-grid-per-page',
  templateUrl: './grid-per-page.component.html',
  styleUrls: ['./grid-per-page.component.scss']
})
export class GridPerPageComponent implements OnInit {

  @Input() page: Page;

  @Output() setPerPage = new EventEmitter();

  perPageOptions = [10, 20, 50, 100];

  constructor() { }

  ngOnInit(): void {
  }

  onSetPerPage() {
    this.setPerPage.emit(this.page);
  }

}
