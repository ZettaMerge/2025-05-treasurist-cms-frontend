import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'fe-general-announcement-detail',
  templateUrl: './fe-general-announcement-detail.component.html',
  styleUrls: ['./fe-general-announcement-detail.component.scss']
})
export class FeGeneralAnnouncementDetailComponent implements OnInit {
  detailId: any;
  status  = true;
  detail = 'พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (Personal Data Protection Act : PDPA) ประกาศใช้เมื่อวันที่ 24 พฤษภาคม 2562 แต่ได้กำหนดให้หมวดที่สำคัญซึ่งเกี่ยวกับเนื้อหาการคุ้มครองข้อมูลส่วนบุคคลและการกำหนดโทษกรณีที่มีการละเมิดกฎหมายให้มีผลบังคับใช้ใน ปีถัดไป นับแต่ประกาศ';
  constructor(
    private router: Router,
    protected route: ActivatedRoute , ) { }

  ngOnInit(): void {
    this.detailId = this.route.snapshot.paramMap.get('id');
  }
  goEdit() {
    this.router.navigate([`./content-management/announcement/${1}`]);
  }

  goBack() {
    this.router.navigate([`./content-management/announcement-list`]);
  }
}
