import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-view-account-form-email',
  templateUrl: './shared-view-account-form-email.component.html',
  styleUrls: ['./shared-view-account-form-email.component.scss']
})
export class SharedViewAccountFormEmailComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  @Input() data;
  @Input() isNew;
  email: string;
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form) {

  }

  onCancel() {
    this.cancel.emit();
  }

}
