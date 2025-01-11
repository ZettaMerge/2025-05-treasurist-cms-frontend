import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'pn-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnChanges {

  @Input() name = 'global';
  @Input() fullscreen = true;
  @Input() isSearch = false;

  @ViewChild('loadingTpl', { static: true }) loadingTpl: TemplateRef<any>;

  templateLoading: string;
  loadingGlobalPath = 'assets/img/Loading.svg';
  loadingSearchPath = 'assets/img/search-loading.svg';

  constructor() { }

  ngOnInit(): void {
    if (!this.isSearch) {
      // this.templateLoading = `<img src="${this.loadingGlobalPath}" style="width: 150px; height: 150px;"/>`;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isSearch) {
      if (this.isSearch) {
        this.name = 'search';
        this.fullscreen = false;
        this.templateLoading = `<img src="${this.loadingSearchPath}" style="width: 150px; height: 150px;" />`;
      } else {
        // this.templateLoading = `<img src="${this.loadingGlobalPath}" style="width: 150px; height: 150px;"/>`;
      }
    }
  }

}
