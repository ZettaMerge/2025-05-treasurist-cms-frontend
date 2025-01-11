import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentDTO } from '@model';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {CheckPermissionService, ContentService} from '@api';
import {PnStorageService, PopupService} from '@postnerd-core';
import * as _ from 'lodash';
import {PermissionEnum} from "@app/core/variables/permission.enum";
@Component({
  selector: 'fe-pdpa-form-create',
  templateUrl: './fe-pdpa-form-create.component.html',
  styleUrls: ['./fe-pdpa-form-create.component.scss']
})
export class FePDPAFormCreateComponent implements OnInit {

  pdpa: ContentDTO = {} as ContentDTO;
  pdpaId: any;
  message: string;

  dataSub: Subscription;
  saveSub: Subscription;

  canCreate: boolean;
  canView: boolean;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private pdpaService: ContentService,
    private popupService: PopupService,
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

    this.pdpaId = this.route.snapshot.paramMap.get('id');
    console.log('pdpaId', this.pdpaId);
    if (this.pdpaId) {
      this.getDetailPdpa();
    } else {
      this.getDataLastVersion();
    }
  }

  statusChange(event) {
    this.pdpa.isActive = event;
    if (event === true) {
      this.pdpaService.contentActiveGet$('PDPA').subscribe((data) => {
        if (data.version === undefined) {
          this.message = `PDPA เวอร์ชันนี้จะถูกใช้งาน`;
        } else {
          this.message = `PDPA เวอร์ชันนี้ จะถูกใช้แทน เวอร์ชัน ${data.version}`;
        }
      });
    }
    console.log('event', event);
    console.log('status', this.pdpa.isActive);
  }

  clearData() {
    this.pdpa.title = undefined;
    this.pdpa.detail = undefined;
  }

  decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  onSave(form) {
    console.log('form', form);
    this.spinner.show('global');
    this.pdpa.type = 'PDPA';
    if (form.invalid) {
      console.log('valid');
      this.spinner.hide('global');
      return;
    } else {

      this.pdpa.detail = this.decodeHTMLEntities(this.pdpa.detail);
      if (this.pdpa.isActive === undefined) {
        this.pdpa.isActive = false;
      }
      if (this.pdpaId) {
        this.saveSub = this.pdpaService.contentPut$(this.pdpa, _.toNumber(this.pdpaId)).subscribe(data => {
          console.log('save edit: ', data);
          this.spinner.hide('global');
          this.toastrService.success('แก้ไขข้อมูลเรียบร้อย.');
          this.router.navigate([`./content-management/pdpa`]);

        });
      } else {
        this.saveSub = this.pdpaService.contentsPost$(this.pdpa).subscribe((data) => {
          this.spinner.hide('global');
          this.toastrService.success('บันทึกข้อมูลเรียบร้อย.');
          this.router.navigate([`./content-management/pdpa`]);
        });
      }


    }
  }

  goBack() {
    this.router.navigate([`./content-management/pdpa`]);
  }

  getDetailPdpa() {

    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.pdpaService.contentGetById$(_.toNumber(this.pdpaId)).subscribe(data => {
      this.pdpa = data;
      this.spinner.hide('global');
      // console.log('data by id', this.pdpa.detail);
    });

  }


  getDataLastVersion() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.pdpaService.contentGetList$(
      undefined,
      undefined,
      true,
      10,
      1,
      'PDPA',
      undefined,
    ).subscribe(data => {
      const dataLastVersion = _.reduce(data.contents, (obj, item) => {
        obj[item.key] = item.value;
        return obj;
      });
      // console.log('dataLastVersion', dataLastVersion);
      this.pdpa.title = dataLastVersion.title;
      this.pdpa.version = dataLastVersion.version +  1;
      this.pdpa.detail = dataLastVersion.detail;
      this.spinner.hide('global');
    });
  }
}
