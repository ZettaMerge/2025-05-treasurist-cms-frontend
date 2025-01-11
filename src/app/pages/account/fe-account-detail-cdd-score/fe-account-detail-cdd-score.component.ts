import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {CddScoreDTO} from '@model';
import {AccountService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import * as _ from 'lodash';

@Component({
  selector: 'fe-account-detail-cdd-score',
  templateUrl: './fe-account-detail-cdd-score.component.html',
  styleUrls: ['./fe-account-detail-cdd-score.component.scss']
})
export class FeAccountDetailCddScoreComponent implements OnInit {
  @Input() accountId: string;
  @Input() cddScoreData: any;
  @Input() cddDate: any;
  @Input() customerType: string;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  cddScore: CddScoreDTO = {} as CddScoreDTO;
  cddReason: any;
  isCddReason = true;
  cddScoreList = [
    {value: 1, label: 1},
    {value: 2, label: 2},
    {value: 3, label: 3}
  ];

  constructor(
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    console.log('cddDate', this.cddDate);

    if (this.cddScoreData && this.cddScoreData.score === 3) {
      this.isCddReason = false;
      this.cddScore.score = this.cddScoreData.score;
      this.cddScore.cddScoreReason = this.cddScoreData.cddScoreReason;
      this.cddReason = this.cddScoreData.cddScoreReason;
    } else {
      this.cddScore.score = this.cddScoreData.score;
      this.cddScore.cddScoreReason = this.cddScoreData.cddScoreReason;
      this.isCddReason = true;

    }
  }

  cddScoreChange(event) {
    console.log('cddScoreChange', event);
    if (event && event === 3) {
      this.isCddReason = false;
    } else {
      this.cddScore.cddScoreReason = null;
      this.isCddReason = true;
    }
  }

  onSubmit() {
    this.spinner.show('global');

    if (this.cddScoreData.score) {

      this.accountService.accountUpdateCddScorePut$(_.toNumber(this.accountId), this.cddScore).subscribe(data => {
        console.log('data', data);
        this.spinner.hide('global');
        this.save.emit();
      });
    }
  }


  onCancel() {
    this.cancel.emit();
  }

}
