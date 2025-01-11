import { Component, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent } from '@postnerd-core';
import {OpenAccountDTO} from "@model";

@Component({
  selector: 'fe-open-account-form-juristic',
  templateUrl: './fe-open-account-form-juristic.component.html',
  styleUrls: ['./fe-open-account-form-juristic.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FeOpenAccountFormJuristicComponent implements OnInit {
  @ViewChild('riskModal') modal: ModalComponent;
  openAccountData: OpenAccountDTO = {} as OpenAccountDTO;


  constructor(
    private router: Router, ) { }

  ngOnInit(): void {
  }

  onSave(form) {
    if (form.invalid) {
      console.log('invalid');
      // this.spinner.hide('global');
      return;
    }

  }

  onOpenModal() {
    this.modal.open();
  }

  goBack() {
    this.router.navigate([`./account/open-account`]);

  }

}
