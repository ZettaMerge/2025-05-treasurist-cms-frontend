import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import {ModalComponent, PnStorageService, PopupService} from '@postnerd-core';
import { ToastrService } from 'ngx-toastr';
import { ContentDTO } from '@model';
import { Subscription } from 'rxjs';
import {CheckPermissionService, ContentService} from '@api';
import {PermissionEnum} from "@app/core/variables/permission.enum";

export interface Information {
  title: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'fe-faqs-form',
  templateUrl: './fe-faqs-form.component.html',
  styleUrls: ['./fe-faqs-form.component.scss']
})
export class FeFaqsFormComponent implements OnInit {

  faqData: ContentDTO = {} as ContentDTO;
  informationId: any;
  message: string;
  title: string;
  detail: string;

  canCreate: boolean;
  canView: boolean;

  dataSub: Subscription;
  saveSub: Subscription;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private toastrService: ToastrService,
    private contentService: ContentService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
  }

  ngOnInit(): void {
    // CHECK PERMISSION
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.Content).then(result => {
      if (result) {
        this.canCreate = result.canCreate;
        this.canView = result.canView;
      }

      console.log('result', result);
    });
    this.getData();
  }


  getData() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.contentService.contentActiveGet$(
      'FAQs',
    ).subscribe(data => {
      console.log('FAQs', data);
      this.faqData = data;
      this.spinner.hide('global');
    });

  }

  decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    console.log('txt', txt);
    txt.innerHTML = str;
    console.log('txt.innerHTML', txt.innerHTML);
    console.log('txt.value', txt.value);
    return txt.value;
  }

  onSave(form) {
    console.log('form', form);
    this.spinner.show('global');

    if (form.invalid) {
      this.spinner.hide('global');
      return;
    }
    this.faqData.detail = this.decodeHTMLEntities(this.faqData.detail);
    this.saveSub = this.contentService.contentPut$(this.faqData, _.toNumber(this.faqData.id)).subscribe(data => {
      console.log('save edit: ', data);
      this.spinner.hide('global');
      this.toastrService.success('บันทึกข้อมูลเรียบร้อย.');
      this.getData();
    });


  }

  goBack() {
    this.router.navigate([`./content-management`]);
  }

}
