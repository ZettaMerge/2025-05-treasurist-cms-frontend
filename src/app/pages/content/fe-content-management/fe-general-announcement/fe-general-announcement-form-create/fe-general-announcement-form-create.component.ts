import { Component, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {CheckPermissionService} from "@api";
import {PnStorageService} from "@postnerd-core";
import {PermissionEnum} from "@app/core/variables/permission.enum";
export interface AnnouncementDto {
  tittle: string;
  updateDate: string;
  updateBy: string;
  version: string;
  status: string;
  detail: string;
  startDate: string;
  endDate: string;

}
@Component({
  selector: 'fe-general-announcement-form-create',
  templateUrl: './fe-general-announcement-form-create.component.html',
  styleUrls: ['./fe-general-announcement-form-create.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FeGeneralAnnouncementFormCreateComponent implements OnInit {
  announcementId: any;
  announcementData: AnnouncementDto = {} as AnnouncementDto;
  isEdit = false;
  startTime: any;
  endTime: any;

  canView: boolean;
  canCreate: boolean;


  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) { }

  ngOnInit(): void {
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.Content).then(result => {
      if (result) {
        this.canView = result.canView;
        this.canCreate = result.canCreate;
      }
      console.log('result', result);
    });

    this.announcementId = this.route.snapshot.paramMap.get('id');
    console.log('announcementId', this.announcementId);
    if (this.announcementId) {
      this.isEdit = true;
    }
  }

  decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  onSave(form) {
    this.announcementData.detail = this.decodeHTMLEntities(this.announcementData.detail);
  }

  goBack() {
    this.router.navigate([`./content-management/announcement-list`]);

  }

  onChangCheckBoxStatus(event) {
    console.log('onChangCheckBoxStatus', event);
  }

}
