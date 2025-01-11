import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-view-popup-detail-cdd',
  templateUrl: './shared-view-popup-detail-cdd.component.html',
  styleUrls: ['./shared-view-popup-detail-cdd.component.scss']
})
export class SharedViewPopupDetailCddComponent implements OnInit {
  @Output() cancel = new EventEmitter();

  riskList = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onCancel() {
    this.cancel.emit();
  }

}
