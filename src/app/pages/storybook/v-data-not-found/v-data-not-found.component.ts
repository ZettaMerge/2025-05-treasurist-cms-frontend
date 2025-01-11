import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'v-data-not-found',
  templateUrl: './v-data-not-found.component.html',
  styleUrls: ['./v-data-not-found.component.scss']
})
export class VDataNotFoundComponent implements OnInit {

  @Input() isCustom: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
