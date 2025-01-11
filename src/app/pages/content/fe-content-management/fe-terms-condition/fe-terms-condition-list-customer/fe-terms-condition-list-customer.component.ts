import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ContentService } from '@api';
import { BaseFeatureGridComponent } from '@postnerd-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { customerEnumText } from 'src/app/api/constant/EnumText';
interface FilterType {
  version: any;
}
@Component({
  selector: 'fe-terms-condition-list-customer',
  templateUrl: './fe-terms-condition-list-customer.component.html',
  styleUrls: ['./fe-terms-condition-list-customer.component.scss']
})
export class FeTermsConditionListCustomerComponent extends BaseFeatureGridComponent<any> implements OnInit {
  @ViewChild('customerTpl', { static: true }) customerTpl: TemplateRef<any>;
  @ViewChild('nameTpl', { static: true }) nameTpl: TemplateRef<any>;
  @ViewChild('versionTpl', { static: true }) versionTpl: TemplateRef<any>;
  filter: FilterType = {} as FilterType;
  customerEnumText = customerEnumText;

  dataSub: Subscription;
  constructor(
    private contentService: ContentService,
    private spinner: NgxSpinnerService, ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getData();
  }
  filterChange() {
    this.page.page = 1;
    this.getData();
  }

  clearFilter() {
    this.filter.version = undefined;
    this.page.page = 1;
    this.getData();
  }

  protected setColumns() {
    this.columns = [
      {
        name: 'ลูกค้า',
        prop: 'nameOfUser',
        width: 150,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'ประเภทลูกค้า',
        prop: 'userType',
        sortable: false,
        width: 100,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.customerTpl,
      },
      {
        name: 'ประเภทบัญชี',
        prop: 'accountType',
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        width: 130,
      },
      {
        name: 'วันที่ทำรายการ',
        prop: 'acceptedDate',
        sortable: false,
        width: 120,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTimeTpl,
      },
      {
        name: 'เวอร์ชัน',
        prop: 'contentVersion',
        sortable: false,
        width: 100,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.versionTpl,
      },
    ];
  }

  protected getData() {

    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.contentService.contentAcceptedUsers$(
      'id',
      'TermsAndCondition',
      this.filter.version?.version || undefined,
      'asc',
      undefined,
      this.page.perPage,
      undefined,
      this.page.page,
    ).subscribe(data => {
      this.rows = data.contentAcceptedUsers;
      this.page.totalCount = data.pagination.allRecord;
      this.spinner.hide('global');
      console.log('TermsAndCondition', this.rows);
    });

  }

}
