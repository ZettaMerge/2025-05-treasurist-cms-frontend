import { Component, OnInit } from '@angular/core';
import { BaseFeatureTabComponent, PopupService } from '@postnerd-core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContentDTO } from '@model';
import { Subscription } from 'rxjs';
import { ContentService } from '@api';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
enum Tab {
  detail = 1,
  customerList = 2,
}

export interface TermsCondition {
  title: string;
  version: string;
  status: string;
  description: number;
}

@Component({
  selector: 'fe-ndid-detail',
  templateUrl: './fe-ndid-detail.component.html',
  styleUrls: ['./fe-ndid-detail.component.scss']
})
export class FeNdidDetailComponent extends BaseFeatureTabComponent implements OnInit {

  isEdit = false;
  ndidData: ContentDTO = {} as ContentDTO;
  ndidActive: ContentDTO = {} as ContentDTO;
  Tab = Tab;
  tabs = [
    { name: 'รายละเอียด', id: Tab.detail },
    { name: 'รายชื่อลูกค้าที่กดยอมรับ', id: Tab.customerList },
  ];

  ndidId: any;
  confirmCheckStatusText: string;
  dataSub: Subscription;
  saveSub: Subscription;
  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private ndidService: ContentService,
    private toastr: ToastrService,
    private popupService: PopupService,
  ) {
    super(route);
  }

  ngOnInit(): void {
    this.ndidId = this.route.snapshot.paramMap.get('id');
    console.log('ndidId', this.ndidId);
    if (this.ndidId) {
      this.getDetailNdid();
    }
  }

  edit() {
    this.getDetailNdid();
    this.isEdit = !this.isEdit;
    this.activeTabId = 1;
  }

  onClickCheck(event) {
    console.log('onClickCheck', event);
    if (event) {
      this.dataSub = this.ndidService.contentActiveGet$('TERM_NDID').subscribe(data => {
        this.ndidActive = data;
        console.log('Ndid Active', this.ndidActive);
        if (this.ndidActive.version === undefined) {
          this.confirmCheckStatusText = `NDID เวอร์ชันนี้จะถูกใช้งาน`;
        } else {
          this.confirmCheckStatusText = `NDID เวอร์ชันนี้ จะถูกใช้แทน เวอร์ชัน ${this.ndidActive.version}`;
        }

      });
    } else {
      this.ndidData.isActive = false;
    }
  }
  goBack() {
    this.router.navigate([`./content-management/ndid`]);
  }

  onDelete(ndid: ContentDTO) {
    console.log('ContentDTO Delete', ndid);
    this.popupService.confirm(`ลบ NDID`, `คุณต้องการลบ NDID เวอร์ชัน ${ndid.version} หรือไม่ ?`, `danger`)
      .subscribe((data) => {
        if (data) {
          this.spinner.show('global');
          this.ndidService.contentDelete$(ndid.id).subscribe(data => {
            console.log('delete: ', data);
            this.toastr.success('Delete NDID successful.');
            this.router.navigate([`./content-management/ndid`]);
          });
        }
      });
  }


  decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  onSave(form) {
    console.log('form', form);
    this.spinner.show('global');

    if (form.invalid) {
      console.log('valid');
      this.spinner.hide('global');
      return;
    } else {
      this.ndidData.detail = this.decodeHTMLEntities(this.ndidData.detail);
      this.saveSub = this.ndidService.contentPut$(this.ndidData, _.toNumber(this.ndidId)).subscribe(data => {
        console.log('save edit: ', data);
        this.spinner.hide('global');
        this.toastr.success('Update NDID successful.');

      }, (error) => {
        this.spinner.hide('global');
      });
      this.isEdit = !this.isEdit;
    }
  }

  goBackDetail() {
    this.getDetailNdid();
    this.isEdit = !this.isEdit;
  }

  getDetailNdid() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.ndidService.contentGetById$(_.toNumber(this.ndidId)).subscribe(data => {
      this.ndidData = data;
      this.spinner.hide('global');
      console.log('ndid by id', this.ndidData);
    });

  }
}
