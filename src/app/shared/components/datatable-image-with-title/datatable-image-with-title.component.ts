import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'shared-datatable-image-with-name-banner',
  templateUrl: './datatable-image-with-title.component.html',
  styleUrls: ['./datatable-image-with-title.component.scss']
})
export class DatatableImageWithTitleComponent implements OnInit {

  @Input() imageUrl: string;
  @Input() nameTh: string;
  @Input() nameEn: string;
  @Input() isSquare;
  @Input() classTextNameThCustom;
  @Input() classTextNameEnCustom;
  @Input() category: string;
  @Input() pinned: boolean;
  @Input() anonymous: boolean;
  @Input() feature: boolean;
  @Output() nameClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onNameClick() {
    this.nameClick.emit();
  }

}
