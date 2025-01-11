import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'fe-agent-registration-us',
  templateUrl: './fe-agent-registration.component.html',
  styleUrls: ['./fe-agent-registration.component.scss']
})
export class FeAgentRegistrationComponent implements OnInit {
  detailAboutUs: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate([`./content-management`]);
  }

  goToCreate() {
    this.router.navigate([`./content-management/agent-registration/new`]);
  }
  goEdit() {
    this.router.navigate([`./content-management/agent-registration/${1}`]);
  }
}
