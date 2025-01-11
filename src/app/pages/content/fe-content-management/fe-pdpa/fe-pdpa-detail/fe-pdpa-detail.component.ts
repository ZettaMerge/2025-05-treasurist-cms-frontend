import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFeatureTabComponent, PopupService } from '@postnerd-core';
import { ContentDTO } from '@model';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContentService } from '@api';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';


enum Tab {
  detail = 1,
  customer = 2,
}

@Component({
  selector: 'fe-pdpa-detail',
  templateUrl: './fe-pdpa-detail.component.html',
  styleUrls: ['./fe-pdpa-detail.component.scss']
})
export class FePdpaDetailComponent extends BaseFeatureTabComponent implements OnInit {

  isEdit = false;
  pdpa: ContentDTO = {} as ContentDTO;
  pdpaActive: ContentDTO = {} as ContentDTO;

  Tab = Tab;
  tabs = [
    { name: 'รายละเอียด', id: Tab.detail },
    { name: 'รายชื่อลูกค้าที่กดยอมรับ', id: Tab.customer },
  ];
  pdpaId: any;
  confirmCheckStatusText: string;
  dataSub: Subscription;
  saveSub: Subscription;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private pdpaService: ContentService,
    private toastr: ToastrService,
    private popupService: PopupService,
  ) {
    super(route);
  }

  ngOnInit(): void {
    this.pdpaId = this.route.snapshot.paramMap.get('id');
    console.log('termAndConditionId', this.pdpaId);
    if (this.pdpaId) {
      this.getDetailPdpa();
    }
  }

  edit() {
    this.getDetailPdpa();
    this.isEdit = !this.isEdit;
    this.activeTabId = 1;
  }

  onClickCheck(event, item: ContentDTO) {
    console.log('onClickCheck', event);
    if (event) {
      this.dataSub = this.pdpaService.contentActiveGet$('PDPA').subscribe(data => {
        this.pdpaActive = data;
        if (this.pdpaActive.version === undefined) {
          this.confirmCheckStatusText = `PDPA เวอร์ชันนี้จะถูกใช้งาน`;
        } else {
          this.confirmCheckStatusText = `PDPA เวอร์ชันนี้ จะถูกใช้แทน เวอร์ชัน ${this.pdpaActive.version}`;
        }

      });
    } else {
      this.confirmCheckStatusText = '';
      this.pdpa.isActive = false;
    }
  }

  goBack() {
    this.router.navigate([`./content-management/pdpa`]);
  }

  onDelete(pdpa: ContentDTO) {
    console.log('termsCondition Delete', pdpa);
    this.popupService.confirm(`ลบ ข้อกำหนดการใช้งาน`, `คุณต้องการลบ ข้อกำหนดการใช้งาน เวอร์ชัน ${pdpa.version} หรือไม่ ?`, `danger`)
      .subscribe((data) => {
        if (data) {
          this.spinner.show('global');
          this.pdpaService.contentDelete$(pdpa.id).subscribe(data => {
            console.log('delete: ', data);
            this.toastr.success('Delete ข้อกำหนดการใช้งาน successful.');
            this.router.navigate([`./content-management/pdpa`]);
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
      this.pdpa.detail = this.decodeHTMLEntities(this.pdpa.detail);
      this.saveSub = this.pdpaService.contentPut$(this.pdpa, _.toNumber(this.pdpaId)).subscribe(data => {
        console.log('save edit: ', data);
        this.spinner.hide('global');
        this.toastr.success('Update PDPA successful.');

      }, (error) => {
        this.spinner.hide('global');
      });
      this.isEdit = !this.isEdit;
    }
  }

  goBackDetail() {
    this.getDetailPdpa();
    this.isEdit = !this.isEdit;
  }

  getDetailPdpa() {

    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.pdpaService.contentGetById$(_.toNumber(this.pdpaId)).subscribe(data => {
      this.pdpa = data;
      this.spinner.hide('global');
      console.log('data by id', this.pdpa.detail);
    });

  }

}
