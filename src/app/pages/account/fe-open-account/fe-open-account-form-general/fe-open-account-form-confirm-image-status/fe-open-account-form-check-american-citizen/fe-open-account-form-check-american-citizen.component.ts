import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'fe-open-account-form-check-american-citizen',
  templateUrl: './fe-open-account-form-check-american-citizen.component.html',
  styleUrls: ['./fe-open-account-form-check-american-citizen.component.scss']
})
export class FeOpenAccountFormCheckAmericanCitizenComponent implements OnInit {
  @Output() cancel = new EventEmitter();

  americanDataList = [
    {id: 1, title: 'มีสัญชาติอเมริกัน / เกิดที่สหรับอเมริกา / มีที่อยู่ถาวรสหรัฐอเมริกา', isAllow: false},
    {id: 2, title: 'มีที่อยู่ปัจจุบัน หรือที่อยู่เพื่อการติดต่อ หรือที่อยู่เพื่อรับส่งไปรษณีย์แทน ในสหรัฐอเมริกา', isAllow: false},
    {id: 3, title: 'มีที่อยู่ชั่วคราวในสหรัฐอเมริกา หรือ เคยอาศัยอยู่ในอเมริกาเกินกว่า 183 วัน', isAllow: false},
    {id: 4, title: 'มีหมายเลขโทรศัพท์ในสหรัฐอเมริกา', isAllow: false},
    {id: 5, title: 'มีการมอบอำนาจให้บุคคลอื่นที่มีที่อยู่ในสหรัฐอเมริกา ดำเนินการเกี่ยวข้องกับบัญชีแทน', isAllow: false},
    {id: 6, title: 'มีการตั้งคำสั่งทำรายการโอนเงินเป็นประจำล่วงหน้าไปยังบัญชีที่อยู่ในสหรัฐอเมริกา', isAllow: false},
    {id: 7, title: 'เป็นบริษัทที่มีการจดทะเบียนจัดตั้งในสหรัฐอเมริกา', isAllow: false},
    {id: 7, title: 'เป็นบริษัทที่มีข้อมูลบ่งชี้ได้ว่า มีความเกี่ยวพันกับสหรัฐอเมริกาซึ่งมีบุคคลอเมริกัน เป็นผู้ถือหุ้นไม่ว่าทางตรงหรือทางอ้อม ในสัดส่วนของหุ้นรวมกันเกินกว่า 10%', isAllow: false},
  ];
  constructor() { }

  ngOnInit(): void {
  }

  onCancel() {
    this.cancel.emit(this.americanDataList);
  }

  onSelectAmericanChange(event, americanData, index) {
    this.americanDataList[index].isAllow = event;
  }

}
