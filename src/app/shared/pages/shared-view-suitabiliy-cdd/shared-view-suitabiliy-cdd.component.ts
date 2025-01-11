import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '@postnerd-core';
import * as moment from 'moment';
@Component({
  selector: 'shared-view-suitabiliy-cdd',
  templateUrl: './shared-view-suitabiliy-cdd.component.html',
  styleUrls: ['./shared-view-suitabiliy-cdd.component.scss']
})
export class SharedViewSuitabiliyCddComponent implements OnInit {
  @ViewChild('detailRiskModal') detailRiskModal: ModalComponent;
  @ViewChild('detailCddModal') detailCddModal: ModalComponent;
  @Input() data;
  date = '2021-07-21T06:22:38.507Z';
  fx = true;
  comMo = false;
  constructor() { }

  ngOnInit(): void {
  }

  convertDate(date) {
    // console.log('reviewDate', date);
    return date ? moment(date, 'YYYYMMDD').format('DD/MM/YYYY') : '-';
  }

  onOpenRiskDetailModal() {
    this.detailRiskModal.open();
  }

  onOpenCddDetailModal() {
    this.detailCddModal.open();
  }
}
