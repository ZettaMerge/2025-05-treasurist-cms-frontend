import {Component, OnInit, ViewChild} from '@angular/core';
import {CustomerProfileDTO} from '@model';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';
import * as _ from 'lodash';
import {ModalComponent} from '@postnerd-core';

@Component({
  selector: 'fe-account-legal-entity-detail',
  templateUrl: './fe-account-legal-entity-detail.component.html',
  styleUrls: ['./fe-account-legal-entity-detail.component.scss']
})
export class FeAccountLegalEntityDetailComponent implements OnInit {

  @ViewChild('formNoteModal') formNoteModal: ModalComponent;

  customerId: string;
  customerData: CustomerProfileDTO = {} as CustomerProfileDTO;
  date = '2021-07-21T06:22:38.507Z';
  dataSub: Subscription;
  legalEntity = true;

  fx = true;
  comMo = false;

  staffData = [
    {name: 'ศุกณพัฒน์ จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '3214567890', signAuthority: true, executive: true},
    {name: 'สุรศักดิ์ จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '23456890', signAuthority: true, executive: false},
    {name: 'ภาคศิริ ธนพัชรศิริ', national: 'ไทย', idType: 'ID Card', idNo: '09878656', signAuthority: true, executive: false},
    {name: 'เกรียงไกร จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '0986876', signAuthority: true, executive: false},
    {name: 'มีนา จิรวุฒิตานันท์', national: 'ไทย', idType: 'ID Card', idNo: '231456789', signAuthority: true, executive: false},
    ];

  nameList = [
    {name: 'บริษัทหลักทรัพย์ที่ปรึกษาการลงทุนเทรเชอร์ริสต์ จำกัด', tel: '09897687', national: 'Thai', type: 'business' },
    {name: 'ศุกณพัฒน์ จิรวุฒิตานันท์', tel: '09897687', national: 'Thai', type: 'individual' },
    {name: 'ภาคศิริ ธนพัชรศิริ', tel: '09897687', national: 'Thai', type: 'individual' },
    {name: 'สุรศักดิ์ จิรวุฒิตานันท์', tel: '09897687', national: 'Thai', type: 'individual' },
  ];

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService, private toastrService: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.getCustomerProfileById();
    console.log('customer ID', this.customerId);
    // this.toastrService.error('Delete success.');
    // this.toastrService.success('Delete success.');

  }

  goBack() {
    this.router.navigate([`./account/account-ats-approval`]);
  }

  convertDate(date) {
    if (date) {
      const convertDate = moment(date, 'YYYYMMDD');
      date = convertDate.format('DD/MM/YYYY');
      return date;
    } else {
      date = '-';
      return date;
    }
  }

  getCustomerProfileById() {

    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.customerService.customerIdGet$(_.toNumber(this.customerId)).subscribe(data => {
      this.customerData = data;
      this.spinner.hide('global');
      console.log('data by id', this.customerData);
    });
  }

  goToNoteForm(event) {
    this.formNoteModal.open();
  }

}
