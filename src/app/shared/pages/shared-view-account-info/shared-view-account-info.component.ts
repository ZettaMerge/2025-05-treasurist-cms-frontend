import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '@postnerd-core';
import {OpenAccountDTO} from "@model";

@Component({
  selector: 'shared-view-account-info',
  templateUrl: './shared-view-account-info.component.html',
  styleUrls: ['./shared-view-account-info.component.scss']
})
export class SharedViewAccountInfoComponent implements OnInit {
  @ViewChild('formEmailModal') formEmailModal: ModalComponent;
  @ViewChild('formPassWordModal') formPassWordModal: ModalComponent;
  @ViewChild('formPincodeModal') formPincodeModal: ModalComponent;
  @Input() data: OpenAccountDTO = {} as OpenAccountDTO;;
  @Input() isNew: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  onOpenEditEmailModal() {
    this.formEmailModal.open();
  }

  onOpenEditPassWordModal() {
    this.formPassWordModal.open();
  }

  onOpenEditPincodeModal() {
    this.formPincodeModal.open();
  }
}

