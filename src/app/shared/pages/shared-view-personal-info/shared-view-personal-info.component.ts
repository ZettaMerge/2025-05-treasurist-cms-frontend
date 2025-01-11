import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as moment from 'moment';
import {DropdownService} from "@api";

@Component({
  selector: 'shared-view-personal-info',
  templateUrl: './shared-view-personal-info.component.html',
  styleUrls: ['./shared-view-personal-info.component.scss']
})
export class SharedViewPersonalInfoComponent implements OnInit, OnChanges {

  @Input() data;

  maritalStatus: string;
  openAccountType: string;
  accountVerifyType: string;
  nationality: string;

  constructor(
    protected dropdownService: DropdownService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // check สัญชาติ
    if (this.data.nationality) {
      this.dropdownService.dropdownNationalityGet$().subscribe(data => {
        const findNation = data.find(n => n.value === this.data.nationality);
        console.log('findNation', findNation);
        this.nationality = findNation.name;
      });
    }

    // check สถานภาพ
    if (this.data.maritalStatus) {
      this.maritalStatus = this.data.maritalStatus === 'Single' ? 'โสด' :
        this.data.maritalStatus === 'Married' ? 'สมรส' :
          this.data.maritalStatus === 'Divorce' ? 'หย่า' : 'อื่นๆ';
    }

    if (this.data.openAccountType) {
      this.openAccountType = 'Single form';
    }

    if (this.data.accountVerifyType) {
      this.accountVerifyType = 'NDID';
    }
  }

  ngOnInit(): void {

  }

}
