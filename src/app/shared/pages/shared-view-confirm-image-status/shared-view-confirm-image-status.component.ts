import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '@postnerd-core';

@Component({
  selector: 'shared-view-confirm-image-status',
  templateUrl: './shared-view-confirm-image-status.component.html',
  styleUrls: ['./shared-view-confirm-image-status.component.scss']
})
export class SharedViewConfirmImageStatusComponent implements OnInit {
  @ViewChild('detailCriminalModal') detailCriminalModal: ModalComponent;
  @ViewChild('detailAmericanCitizenModal') detailAmericanCitizenModal: ModalComponent;
  @Input() data;
  constructor() { }

  ngOnInit(): void {
  }

  onOpenDetailCriminalModal() {
    this.detailCriminalModal.open();
  }

  onOpenDetailAmericanCitizenModal() {
    this.detailAmericanCitizenModal.open();
  }



}
