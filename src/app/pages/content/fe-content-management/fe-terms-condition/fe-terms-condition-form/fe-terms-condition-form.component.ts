import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContentDTO } from '@model';
import { ToastrService } from 'ngx-toastr';
import {CheckPermissionService, ContentService} from '@api';
import {PnStorageService, PopupService} from '@postnerd-core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import {PermissionEnum} from "@app/core/variables/permission.enum";


@Component({
  selector: 'fe-terms-condition-form',
  templateUrl: './fe-terms-condition-form.component.html',
  styleUrls: ['./fe-terms-condition-form.component.scss']
})
export class FeTermsConditionFormComponent implements OnInit {

  termsCondition: ContentDTO = {} as ContentDTO;
  message: string;

  termAndConditionId: any;
  dataSub: Subscription;
  saveSub: Subscription;

  canCreate: boolean;
  canView: boolean;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private termAndConditionService: ContentService,
    private popupService: PopupService,
    protected route: ActivatedRoute,
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

    this.termAndConditionId = this.route.snapshot.paramMap.get('id');
    console.log('termAndConditionId', this.termAndConditionId);
    if (this.termAndConditionId) {
      this.getDetailTermAndCondition();
    } else {
      this.getDataLastVersion();
    }
  }

  statusChange(event) {
    this.termsCondition.isActive = event;
    if (event === true) {
      this.termAndConditionService.contentActiveGet$('TermsAndCondition').subscribe((data) => {
        if (data.version === undefined) {
          this.message = `ข้อกำหนดการใช้งาน เวอร์ชันนี้จะถูกใช้งาน`;
        } else {
          this.message = `ข้อกำหนดการใช้งาน เวอร์ชันนี้ จะถูกใช้แทน เวอร์ชัน ${data.version}`;
        }
      });
    }
    console.log('event', event);
    console.log('status', this.termsCondition.isActive);
  }


  clearData() {
    this.termsCondition.title = undefined;
    this.termsCondition.detail = undefined;
  }

  decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }
  onSave(form) {
    console.log('form', form);
    this.spinner.show('global');
    this.termsCondition.type = 'TermsAndCondition';

    if (form.invalid) {
      console.log('valid');
      this.spinner.hide('global');
      return;
    } else {

      this.termsCondition.detail = this.decodeHTMLEntities(this.termsCondition.detail);
      if (this.termsCondition.isActive === undefined) {
        this.termsCondition.isActive = false;
      }
      if (this.termAndConditionId) {
        this.saveSub = this.termAndConditionService.contentPut$(this.termsCondition, _.toNumber(this.termAndConditionId)).subscribe(data => {
          console.log('save edit: ', data);
          this.spinner.hide('global');
          this.toastrService.success('แก้ไขข้อมูลเรียบร้อย.');
          this.router.navigate([`./content-management/terms-and-condition`]);
        });

      } else {
        this.saveSub = this.termAndConditionService.contentsPost$(this.termsCondition).subscribe((data) => {
          this.spinner.hide('global');
          this.toastrService.success('บันทึกข้อมูลเรียบร้อย.');
          this.router.navigate([`./content-management/terms-and-condition`]);
        });
      }

    }
  }

  goBack() {
    this.router.navigate([`./content-management/terms-and-condition`]);
  }

  getDetailTermAndCondition() {

    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.termAndConditionService.contentGetById$(_.toNumber(this.termAndConditionId)).subscribe(data => {
      this.termsCondition = data;
      this.spinner.hide('global');
      console.log('data by id', this.termsCondition);
    });

  }

  getDataLastVersion() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.termAndConditionService.contentGetList$(
      undefined,
      undefined,
      true,
      10,
      1,
      'TermsAndCondition',
      undefined,
    ).subscribe(data => {
      const dataLastVersion = _.reduce(data.contents, (obj, item) => {
        obj[item.key] = item.value;
        return obj;
      });
      console.log('dataLastVersion', dataLastVersion);
      this.termsCondition.title = dataLastVersion.title;
      this.termsCondition.version = dataLastVersion.version + 1;
      this.termsCondition.detail = dataLastVersion.detail;
      this.spinner.hide('global');
    });

  }
}
