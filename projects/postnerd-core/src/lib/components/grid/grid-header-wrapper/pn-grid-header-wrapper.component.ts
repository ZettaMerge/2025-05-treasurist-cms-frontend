import { Component, OnInit, ViewChild, TemplateRef, ContentChild } from '@angular/core';

@Component({
  selector: 'pn-lib-grid-header-wrapper',
  templateUrl: './grid-header-wrapper.component.html',
  styleUrls: ['./grid-header-wrapper.component.scss'],
})
export class PnGridHeaderWrapperComponent implements OnInit {

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ContentChild('contentTemplate', { static: true }) contentTemplate: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
