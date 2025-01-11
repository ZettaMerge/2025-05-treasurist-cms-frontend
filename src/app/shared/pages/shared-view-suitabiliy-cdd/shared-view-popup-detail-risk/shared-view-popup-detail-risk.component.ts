import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-view-popup-detail-risk',
  templateUrl: './shared-view-popup-detail-risk.component.html',
  styleUrls: ['./shared-view-popup-detail-risk.component.scss']
})
export class SharedViewPopupDetailRiskComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onCancel() {
    this.cancel.emit();
  }

}
