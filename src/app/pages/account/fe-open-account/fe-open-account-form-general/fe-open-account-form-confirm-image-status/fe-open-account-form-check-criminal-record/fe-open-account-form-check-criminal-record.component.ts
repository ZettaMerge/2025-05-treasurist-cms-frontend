import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'fe-open-account-form-check-criminal-record',
  templateUrl: './fe-open-account-form-check-criminal-record.component.html',
  styleUrls: ['./fe-open-account-form-check-criminal-record.component.scss']
})
export class FeOpenAccountFormCheckCriminalRecordComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  constructor() { }

  criminalDataList = [
    {id: 1, title: 'มีความสัมพันธ์กับการเมืองมีประวัติการกระทำผิดกฎหมายฟอกเงินในช่วงสามปีที่ผ่านมา', isAllow: false},
    {id: 2, title: 'เคยถูกปฎิเสธการเปิดบัญชีจากสถาบันการเงิน', isAllow: false},
    {id: 3, title: 'เคยหรืออยู่ระหว่างการถูกฟ้องร้อง/ถูกบังคับคดีทางศาล', isAllow: false},
    {id: 4, title: 'มีบุคคลที่ได้รับผลประโยชน์จากการทำธุรกรรม หรือมีอำนาจควบคุมการทำธุรกรรม (ตรวจสอบนอมอนี)', isAllow: false},
  ];

  ngOnInit(): void {
  }

  onCancel() {
    this.cancel.emit(this.criminalDataList);
  }

  onSelectCriminalChange(event, criminalData, index) {
    console.log('event', event);
    this.criminalDataList[index].isAllow = event;
  }
}
