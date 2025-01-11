import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {RejectAccountReasonService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import {RejectAccountReasonDTO} from '@model';

@Component({
  selector: 'fe-reject-detail',
  templateUrl: './fe-reject-detail.component.html',
  styleUrls: ['./fe-reject-detail.component.scss']
})
export class FeRejectDetailComponent implements OnInit {
  @Input() accountId: number;
  @Output() cancel = new EventEmitter();

  rejectAccountReasonData: RejectAccountReasonDTO[] = [];

  constructor(
    private rejectAccountReasonService: RejectAccountReasonService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    if (this.accountId) {
      this.getRejectList();
    }
  }

  getRejectList() {

    this.spinner.show('global');
    this.rejectAccountReasonService.rejectAccountReasonListGet$(this.accountId).subscribe( data => {
      console.log('data', data.rejectAccountReasons);
      this.rejectAccountReasonData = data.rejectAccountReasons;
      this.spinner.hide('global');
      console.log('rejectAccountReasonData', this.rejectAccountReasonData);
    });
  }

  onCancel() {
    this.cancel.emit();
  }

}
