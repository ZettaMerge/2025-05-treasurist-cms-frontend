import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'fe-general-contact-us',
  templateUrl: './fe-general-contact-us.component.html',
  styleUrls: ['./fe-general-contact-us.component.scss']
})
export class FeGeneralContactUsComponent implements OnInit {
  detailEmail: string;
  // detailEmail = '<strong>ช่องทางการติกต่อ</strong><br></br>1.สำหรับสอบสอบข้อมูลและแจ้งปัญหาการใช้งาน อีเมล์: support@treasurist.com Facebook Messenger: m.me/treasurist</br>2.สำหรับเรื่องร้องเรียน อีเมล: compliance@treasurist.com</br>';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate([`./content-management`]);
  }

  goToCreate() {
    this.router.navigate([`./content-management/contact-us/new`]);
  }
  goEdit() {
    this.router.navigate([`./content-management/contact-us/${1}`]);
  }
}
