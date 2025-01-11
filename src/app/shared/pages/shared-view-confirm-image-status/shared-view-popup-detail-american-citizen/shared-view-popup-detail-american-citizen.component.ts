import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-view-popup-detail-american-citizen',
  templateUrl: './shared-view-popup-detail-american-citizen.component.html',
  styleUrls: ['./shared-view-popup-detail-american-citizen.component.scss']
})
export class SharedViewPopupDetailAmericanCitizenComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onCancel() {
    this.cancel.emit();
  }

}
