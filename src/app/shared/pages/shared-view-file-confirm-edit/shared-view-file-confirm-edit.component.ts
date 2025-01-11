import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-view-file-confirm-edit',
  templateUrl: './shared-view-file-confirm-edit.component.html',
  styleUrls: ['./shared-view-file-confirm-edit.component.scss']
})
export class SharedViewFileConfirmEditComponent implements OnInit {

  @Input() data: any;

  fileData = [
    {fileName: 'ไฟล์ยืนยันแก้ไขอีเมล' , remark: '-', date: '2021-07-21T06:22:38.507Z', updateBy: 'Ireans Bay'},
    {fileName: 'ไฟล์ยืนยันแก้ไขเบอร์โทรศัพท์' , remark: '-', date: '2021-07-21T06:22:38.507Z', updateBy: 'Ireans Bay'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
