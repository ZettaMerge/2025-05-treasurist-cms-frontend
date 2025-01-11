import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CheckPermissionService, ContentService} from '@api';
import { ContentDTO } from '@model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import {PnStorageService} from "@postnerd-core";
import {PermissionEnum} from "@app/core/variables/permission.enum";

@Component({
  selector: 'fe-general-contact-us-form',
  templateUrl: './fe-general-contact-us-form.component.html',
  styleUrls: ['./fe-general-contact-us-form.component.scss']
})
export class FeGeneralContactUsFormCreateComponent implements OnInit {

  contactUsData: ContentDTO = {} as ContentDTO;
  dataSub: Subscription;
  saveSub: Subscription;

  canCreate: boolean;
  canView: boolean;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private contentService: ContentService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
    ) { }

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
      'ContactUs',
    ).subscribe(data => {
      console.log('ContactUs', data);
      this.contactUsData = data;
      this.spinner.hide('global');
    });

  }

  decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  onSave(form) {
    this.spinner.show('global');
    if (form.invalid) {
      this.spinner.hide('global');
      return;
    }

    this.contactUsData.detail = this.decodeHTMLEntities(this.contactUsData.detail);
    this.saveSub = this.contentService.contentPut$(this.contactUsData, _.toNumber(this.contactUsData.id)).subscribe(data => {
      console.log('save edit: ', data);
      this.spinner.hide('global');
      this.toastrService.success('บันทึกข้อมูลเรียบร้อย.');
      this.getData();
    });

  }

  goBack() {
    this.router.navigate([`./content-management`]);
  }

  onCancel() {

  }

}
