import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CheckPermissionService, ContentService} from '@api';
import { ContentDTO } from '@model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import {PermissionEnum} from "@app/core/variables/permission.enum";
import {PnStorageService} from "@postnerd-core";

@Component({
  selector: 'fe-agent-registration-form',
  templateUrl: './fe-agent-registration-form.component.html',
  styleUrls: ['./fe-agent-registration-form.component.scss']
})
export class FeAgentRegistrationFormCreateComponent implements OnInit {

  agentRegistrationData: ContentDTO = {} as ContentDTO;
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
      'AgentRegistration',
    ).subscribe(data => {
      console.log('AgentRegistration', data);
      this.agentRegistrationData = data;
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

    this.agentRegistrationData.detail = this.decodeHTMLEntities(this.agentRegistrationData.detail);
    this.saveSub = this.contentService.contentPut$(this.agentRegistrationData, _.toNumber(this.agentRegistrationData.id)).subscribe(data => {
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
