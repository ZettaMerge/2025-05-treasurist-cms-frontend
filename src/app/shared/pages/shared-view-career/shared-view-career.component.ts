import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DropdownService} from '@api';

@Component({
  selector: 'shared-view-career',
  templateUrl: './shared-view-career.component.html',
  styleUrls: ['./shared-view-career.component.scss']
})
export class SharedViewCareerComponent implements OnInit, OnChanges {

  @Input() data: any;

  occupationId: any;
  occupationOther: string;
  businessTypeId: string;
  businessTypeOther: string;
  isShowWorkAddress: boolean;
  isWorkAddressIdCard = false;
  isWorkCurrentAddress = false;
  isWorkAddressOther = false;

  constructor(
    protected dropdownService: DropdownService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // check work Address By occupation
    if (this.data.occupationId) {
      this.dropdownService.dropdownOccupationGet$().subscribe(data => {
        const findOccupation = data.find(occ => occ.value === this.data.occupationId);
        const occupationId = findOccupation;
        this.occupationId = occupationId.name;
        console.log('occ', this.occupationId);

        // check ข้อมูลอาชีพ และที่อยู่ที่ทำงาน
        if (this.occupationId) {

          if (occupationId.name === 'เกษตรกร' || occupationId.name === 'พระภิกษุ /นักบวช' ||
            occupationId.name === 'แม่บ้าน/พ่อบ้าน' || this.occupationId.name === 'เกษียณอายุ' ||
            this.occupationId.name === 'นักเรียน/นักศึกษา') {
            console.log('hello gdK9ii');
            this.isShowWorkAddress = false;
          } else if (occupationId.name === 'พนักงานบริษัท' || occupationId.name === 'แพทย์/พยาบาล' ||
            occupationId.name === 'ข้าราชการ' || occupationId.name === 'นักลงทุน' ||
            occupationId.name === 'พนักงานรัฐวิสาหกิจ' || occupationId.name === 'อาชีพอิสระ' ||
            occupationId.name === 'ครู/อาจารย์' || occupationId.name === 'นักการเมือง') {
            this.isShowWorkAddress = true;
          } else if (occupationId.name === 'เจ้าของกิจการ / ธุรกิจส่วนตัว' || occupationId.name === 'กิจการครอบครัว') {

            this.isShowWorkAddress = true;
          } else if (occupationId.name === 'อื่นๆ') {

            this.isShowWorkAddress = true;
          } else {

            this.isShowWorkAddress = false;
          }
        }

        // check ที่อยู่ที่ทำงาน
        if (this.data.workAddressFlag) {
          if (this.data.workAddressFlag === 'IdDocument') {
            this.isWorkAddressIdCard = true;

          } else if (this.data.workAddressFlag === 'Current') {
            this.isWorkCurrentAddress = true;
          }

        } else {
          this.isWorkAddressOther = true;
        }
      });
    }
  }

  ngOnInit(): void {
  }

}
