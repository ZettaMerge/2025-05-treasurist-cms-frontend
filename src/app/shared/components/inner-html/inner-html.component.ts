import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'shared-inner-html',
  templateUrl: './inner-html.component.html',
  styleUrls: ['./inner-html.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InnerHtmlComponent implements OnInit {

  @Input() html;

  isReadMore = true;

  constructor() { }

  ngOnInit(): void {
  }

  showText() {
    this.isReadMore = !this.isReadMore;
  }

}
