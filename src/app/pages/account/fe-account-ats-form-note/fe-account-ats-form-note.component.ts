import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {RejectAccountReasonService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import {RejectAccountReasonDTO} from '@model';


@Component({
  selector: 'fe-account-ats-form-note',
  templateUrl: './fe-account-ats-form-note.component.html',
  styleUrls: ['./fe-account-ats-form-note.component.scss']
})
export class FeAccountAtsFormNoteComponent implements OnInit {
  @Input() accountId: number;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  rejectAccountReasonData: RejectAccountReasonDTO[] = [];
  rejectReasonData: RejectAccountReasonDTO = {} as RejectAccountReasonDTO;
  note: string;
  rejectNoteData = [
    {
      firstName: 'กนกวรรณ', lastName: 'เลิศสรรพสุข', date: '01/02/2022 10:30 น.',
      note: 'Reading practice to help you understand simple texts and find specific information in everyday material.' +
        ' Texts include emails, invitations, personal messages, tips, notices and signs.'
    },
    {
      firstName: 'กนกวรรณ', lastName: 'เลิศสรรพสุข', date: '03/02/2022 10:30 น.',
      note: 'Reading practice to help you understand simple texts and find specific information in everyday material.' +
        ' Texts include emails, invitations, personal messages, tips, notices and signs.'
    },
    {
      firstName: 'กนกวรรณ', lastName: 'เลิศสรรพสุข', date: '05/02/2022 10:30 น.',
      note: 'Reading practice to help you understand simple texts and find specific information in everyday material.' +
        ' Texts include emails, invitations, personal messages, tips, notices and signs.'
    },
    {
      firstName: 'กนกวรรณ', lastName: 'เลิศสรรพสุข', date: '05/02/2022 10:30 น.',
      note: 'Reading practice to help you understand simple texts and find specific information in everyday material.' +
        ' Texts include emails, invitations, personal messages, tips, notices and signs.'
    },
    {
      firstName: 'กนกวรรณ', lastName: 'เลิศสรรพสุข', date: '05/02/2022 10:30 น.',
      note: 'Reading practice to help you understand simple texts and find specific information in everyday material.' +
        ' Texts include emails, invitations, personal messages, tips, notices and signs.'
    },
    {
      firstName: 'กนกวรรณ', lastName: 'เลิศสรรพสุข', date: '05/02/2022 10:30 น.',
      note: 'Reading practice to help you understand simple texts and find specific information in everyday material.' +
        ' Texts include emails, invitations, personal messages, tips, notices and signs.'
    },
  ];

  constructor(
    private rejectAccountReasonService: RejectAccountReasonService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    if (this.accountId) {
      this.getRejectList();
    }
  }

  getRejectList() {
    this.spinner.show('global');
    this.rejectAccountReasonService.rejectAccountReasonListGet$(this.accountId).subscribe(data => {
      console.log('data', data.rejectAccountReasons);
      this.rejectAccountReasonData = data.rejectAccountReasons;
      this.spinner.hide('global');
      console.log('rejectAccountReasonData', this.rejectAccountReasonData);
    });
  }

  onCancel(event) {
    this.cancel.emit(event);
  }

  onSubmit(form) {
    this.spinner.show('global');
    if (form.invalid) {
      this.spinner.hide('global');
      return;
    } else {

      this.rejectReasonData.accountId = this.accountId;
      this.rejectAccountReasonService.rejectAccountReasonPost$(this.rejectReasonData).subscribe(data => {
        console.log('reject post data iss', data);
        this.save.emit(data);
        this.spinner.hide('global');
      });
    }

  }
}
