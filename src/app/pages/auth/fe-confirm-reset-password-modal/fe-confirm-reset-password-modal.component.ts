import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '@postnerd-core';

@Component({
  selector: 'fe-confirm-reset-password-modal',
  templateUrl: './fe-confirm-reset-password-modal.component.html',
  styleUrls: ['./fe-confirm-reset-password-modal.component.scss']
})
export class FeConfirmResetPasswordModalComponent implements OnInit {

  @Output() cancel = new EventEmitter<any>();

  constructor(
    private router: Router, ) { }

  ngOnInit(): void {
  }

  goToLogin() {
    this.router.navigate(['./auth/login']);
    this.cancel.emit();
  }
}
