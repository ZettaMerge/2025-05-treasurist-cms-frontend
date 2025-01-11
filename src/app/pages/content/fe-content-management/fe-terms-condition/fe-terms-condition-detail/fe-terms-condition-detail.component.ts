import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentDTO } from '@model';
import { BaseFeatureTabComponent, PopupService } from '@postnerd-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { ContentService } from '@api';
import { ToastrService } from 'ngx-toastr';
enum Tab {
  detail = 1,
  customerList = 2,
}

@Component({
  selector: 'fe-terms-condition-detail',
  templateUrl: './fe-terms-condition-detail.component.html',
  styleUrls: ['./fe-terms-condition-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeTermsConditionDetailComponent extends BaseFeatureTabComponent implements OnInit {

  isEdit = false;
  termsCondition: ContentDTO = {} as ContentDTO;
  termsAndConditionActive: ContentDTO = {} as ContentDTO;
  Tab = Tab;
  tabs = [
    { name: 'รายละเอียด', id: Tab.detail },
    { name: 'รายชื่อลูกค้าที่กดยอมรับ', id: Tab.customerList },
  ];
  termAndConditionId: any;
  confirmCheckStatusText: string;
  dataSub: Subscription;
  saveSub: Subscription;
  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private termAndConditionService: ContentService,
    private toastr: ToastrService,
    private popupService: PopupService,
  ) {
    super(route);
  }

  ngOnInit(): void {
    this.termAndConditionId = this.route.snapshot.paramMap.get('id');
    console.log('termAndConditionId', this.termAndConditionId);
    if (this.termAndConditionId) {
      this.getDetailTermAndCondition();
    }
  }

  edit() {
    this.getDetailTermAndCondition();
    this.isEdit = !this.isEdit;
    this.activeTabId = 1;
  }

  onClickCheck(event, item: ContentDTO) {
    console.log('onClickCheck', event);
    if (event) {
      this.dataSub = this.termAndConditionService.contentActiveGet$('TermsAndCondition').subscribe(data => {
        this.termsAndConditionActive = data;
        console.log('terms And Condition Active', this.termsAndConditionActive);
        if (this.termsAndConditionActive.version === undefined) {
          this.confirmCheckStatusText = `ข้อกำหนดการใช้งาน เวอร์ชันนี้จะถูกใช้งาน`;
        } else {
          this.confirmCheckStatusText = `ข้อกำหนดการใช้งาน เวอร์ชันนี้ จะถูกใช้แทน เวอร์ชัน ${this.termsAndConditionActive.version}`;
        }
      });
    } else {
      this.confirmCheckStatusText = '';
      this.termsCondition.isActive = false;
    }
  }

  goBack() {
    this.router.navigate([`./content-management/terms-and-condition`]);
  }

  onDelete(termsCondition: ContentDTO) {
    console.log('termsCondition Delete', termsCondition);
    this.popupService.confirm(`ลบ ข้อกำหนดการใช้งาน`, `คุณต้องการลบ ข้อกำหนดการใช้งาน เวอร์ชัน ${termsCondition.version} หรือไม่ ?`, `danger`)
      .subscribe((data) => {
        if (data) {
          this.spinner.show('global');
          this.termAndConditionService.contentDelete$(termsCondition.id).subscribe(data => {
            console.log('delete: ', data);
            this.toastr.success('Delete ข้อกำหนดการใช้งาน successful.');
            this.router.navigate([`./content-management/terms-and-condition`]);
          });
        }
      });

  }

  decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  onSave(form: any) {
    console.log('form', form);
    this.spinner.show('global');

    if (form.invalid) {
      console.log('valid');
      this.spinner.hide('global');
      return;
    } else {

      this.termsCondition.detail = this.decodeHTMLEntities(this.termsCondition.detail);

      this.saveSub = this.termAndConditionService.contentPut$(this.termsCondition, _.toNumber(this.termAndConditionId)).subscribe(data => {
        console.log('save edit: ', data);
        this.spinner.hide('global');
        this.toastr.success('Update ข้อกำหนดการใช้งาน successful.');

      }, (error) => {
        this.spinner.hide('global');
      });
      this.isEdit = !this.isEdit;
    }
  }

  goBackDetail() {
    this.getDetailTermAndCondition();
    this.isEdit = !this.isEdit;
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

}
