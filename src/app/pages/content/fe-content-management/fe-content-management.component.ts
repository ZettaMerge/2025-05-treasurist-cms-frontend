import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '@api';
import { ContentDTO } from '@model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fe-content-management',
  templateUrl: './fe-content-management.component.html',
  styleUrls: ['./fe-content-management.component.scss']
})
export class FeContentManagementComponent implements OnInit {
  termsAndCondition: ContentDTO = {} as ContentDTO;
  pdpa: ContentDTO = {} as ContentDTO;
  ndid: ContentDTO = {} as ContentDTO;
  dataSub: Subscription;
  constructor(
    private router: Router,
    private contentService: ContentService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.spinner.show('global');
    this.getTermsAndCondition();
    this.getPdpa();
    this.getNdid();
  }


  goTo(type) {
    if (type === 'terms') {
      this.router.navigate([`./content-management/terms-and-condition`]);
    } else if (type === 'pdpa') {
      this.router.navigate([`./content-management/pdpa`]);
    } else if (type === 'email') {
      this.router.navigate([`./content-management/contact-us`]);
    } else if (type === 'announcement') {
      this.router.navigate([`./content-management/announcement-list`]);
    } else if (type === 'ndid') {
      this.router.navigate([`./content-management/ndid`]);
    } else if (type === 'information') {
      this.router.navigate([`./content-management/faqs/new`]);
    } else if (type === 'file') {
      this.router.navigate([`./content-management/general-file`]);
    } else if (type === 'about-us') {
      this.router.navigate([`./content-management/about-us`]);
    } else if (type === 'fa-registration') {
      this.router.navigate([`./content-management/agent-registration`]);
    }
  }

  getTermsAndCondition() {
    this.dataSub = this.contentService.contentActiveGet$(
      'TermsAndCondition',
    ).subscribe(data => {
      this.termsAndCondition = data;
      this.spinner.hide('global');
    });
  }


  getPdpa() {
    this.dataSub = this.contentService.contentActiveGet$(
      'PDPA',
    ).subscribe(data => {
      this.pdpa = data;
      this.spinner.hide('global');
    });
  }

  getNdid() {
    this.dataSub = this.contentService.contentActiveGet$(
      'TERM_NDID',
    ).subscribe(data => {
      this.ndid = data;
      this.spinner.hide('global');
    });
  }

}
