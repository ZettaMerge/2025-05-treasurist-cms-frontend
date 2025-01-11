import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'fe-general-contact-us',
  templateUrl: './fe-about-us.component.html',
  styleUrls: ['./fe-about-us.component.scss']
})
export class FeAboutUsComponent implements OnInit {
  detailAboutUs: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate([`./content-management`]);
  }

  goToCreate() {
    this.router.navigate([`./content-management/about-us/new`]);
  }
  goEdit() {
    this.router.navigate([`./content-management/about-us/${1}`]);
  }
}
