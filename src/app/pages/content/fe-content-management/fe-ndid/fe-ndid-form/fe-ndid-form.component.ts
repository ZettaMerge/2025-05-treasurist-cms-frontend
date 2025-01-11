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
export interface TermsCondition {
  title: string;
  version: string;
  status: string;
  description: number;
}

@Component({
  selector: 'fe-ndid-form',
  templateUrl: './fe-ndid-form.component.html',
  styleUrls: ['./fe-ndid-form.component.scss']
})
export class FeNdidFormComponent implements OnInit {

  ndid: ContentDTO = {} as ContentDTO;
  ndidId: any;

  message: string;
  dataSub: Subscription;
  saveSub: Subscription;

  canCreate: boolean;
  canView: boolean;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private ndidService: ContentService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
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

    this.ndidId = this.route.snapshot.paramMap.get('id');
    console.log('pdpaId', this.ndidId);
    if (this.ndidId) {
      this.getDetailNdid();
    } else {
      this.getDataLastVersion();
    }
  }

  statusChange(event) {
    this.ndid.isActive = event;
    if (event) {
      this.ndidService.contentActiveGet$('TERM_NDID').subscribe((data) => {
        console.log('data NDID เวอร์ชันนี้จะถูกใช้งาน', data);
        if (data.version === undefined) {
          this.message = `NDID เวอร์ชันนี้จะถูกใช้งาน`;
        } else {
          this.message = `NDID เวอร์ชันนี้ จะถูกใช้แทน เวอร์ชัน ${data.version}`;
        }
      });
    }
    console.log('event', event);
    console.log('status', this.ndid.isActive);
  }

  clearData() {
    this.ndid.title = undefined;
    this.ndid.detail = undefined;
  }

  decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  onSave(form) {
    console.log('form', form);
    this.spinner.show('global');
    this.ndid.type = 'TERM_NDID';
    if (form.invalid) {
      console.log('valid');
      this.spinner.hide('global');
      return;
    } else {
      this.ndid.detail = this.decodeHTMLEntities(this.ndid.detail);
      if (this.ndid.isActive === undefined) {
        this.ndid.isActive = false;
      }
      if (this.ndidId) {
        this.saveSub = this.ndidService.contentPut$(this.ndid, _.toNumber(this.ndidId)).subscribe(data => {
          console.log('save edit: ', data);
          this.spinner.hide('global');
          this.toastrService.success('แก้ไขข้อมูลเรียบร้อย.');
          this.router.navigate([`./content-management/ndid`]);

        });
      } else {
        this.saveSub = this.ndidService.contentsPost$(this.ndid).subscribe((data) => {
          this.spinner.hide('global');
          this.toastrService.success('บันทึกข้อมูลเรียบร้อย.');
          this.router.navigate([`./content-management/ndid`]);
        });
      }

    }
  }

  goBack() {
    this.router.navigate([`./content-management/ndid`]);
  }

  getDetailNdid() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.ndidService.contentGetById$(_.toNumber(this.ndidId)).subscribe(data => {
      this.ndid = data;
      this.spinner.hide('global');
      console.log('ndid by id', this.ndid);
    });

  }

  getDataLastVersion() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.ndidService.contentGetList$(
      undefined,
      undefined,
      true,
      10,
      1,
      'TERM_NDID',
      undefined,
    ).subscribe(data => {
      const dataLastVersion = _.reduce(data.contents, (obj, item) => {
        obj[item.key] = item.value;
        return obj;
      });
      // console.log('dataLastVersion', dataLastVersion);
      this.ndid.title = dataLastVersion.title;
      this.ndid.version = dataLastVersion.version + 1;
      this.ndid.detail = dataLastVersion.detail;
      this.spinner.hide('global');
    });
  }
}
