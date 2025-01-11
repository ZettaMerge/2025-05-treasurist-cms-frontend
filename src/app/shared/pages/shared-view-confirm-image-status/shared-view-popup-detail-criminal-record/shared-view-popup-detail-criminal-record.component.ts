import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-view-popup-detail-criminal-record',
  templateUrl: './shared-view-popup-detail-criminal-record.component.html',
  styleUrls: ['./shared-view-popup-detail-criminal-record.component.scss']
})
export class SharedViewPopupDetailCriminalRecordComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onCancel() {
    this.cancel.emit();
  }
}
