import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  Output, EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseFeatureGridComponent, GridTableColumn, ModalComponent, PopupService } from '@postnerd-core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserChecklistService } from '@api';
import { UserCheckListsDTO } from '@model';
import * as _ from 'lodash';

@Component({
  selector: 'fe-regulatory-cdd-checklist',
  templateUrl: './fe-regulatory-cdd-checklist.component.html',
  styleUrls: ['./fe-regulatory-cdd-checklist.component.scss']
})
export class FeRegulatoryCddChecklistComponent extends BaseFeatureGridComponent<UserCheckListsDTO, any> implements OnInit, OnDestroy, OnChanges {

  @ViewChild('regulatoryForm') regulatoryForm: ModalComponent;
  @ViewChild('dateTpl', { static: true }) dateTpl: TemplateRef<any>;
  @ViewChild('cidTpl', { static: true }) cidTpl: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl: TemplateRef<any>;
  @ViewChild('transactionDateTpl', { static: true }) transactionDateTpl: TemplateRef<any>;
  @ViewChild('checkListTypeTpl', { static: true }) checkListTypeTpl: TemplateRef<any>;
  @ViewChild('checkListCodeTypeTpl', { static: true }) checkListCodeTypeTpl: TemplateRef<any>;
  

  @Input() filterSearch: string;
  @Input() filterCode: any;
  @Input() filterStatus: any;
  @Input() canView;
  @Input() canCreate;
  @Output() clearFilter = new EventEmitter<any>();

  regulatoryType = 'cdd';
  filterType: any;


  // cddChecklistTypeDropdown;
  cddChecklistTypeDropdown = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
  ];


  dataSub: Subscription;

  constructor(
    private router: Router,
    private popupService: PopupService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private userChecklistService: UserChecklistService,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterSearch || changes.filterCode || changes.filterStatus || changes.canView || changes.canCreate) {
      console.log('isActive', changes.filterStatus);
      super.ngOnInit();
      this.getData();
      this.setColumns();
    }
  }

  ngOnInit(): void {
  }

  onFilterChange() {
    console.log();
    this.page.page = 1;
    // this.rows = [];
    this.getData();
  }

  protected setColumns() {
    const temp = [
      {
        name: 'เลขบัตรประชาชน /  Passport',
        prop: 'identifyNo',
        width: 150,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.cidTpl,
      },
      {
        name: 'วัน/เดือน/ปีเกิด',
        prop: 'birthdate',
        sortable: false,
        width: 80,
        cellTemplate: this.dateTpl,
      },
      {
        name: 'Type',
        prop: 'type',
        sortable: false,
        width: 80,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.checkListTypeTpl
      },
      {
        name: 'Code',
        prop: 'code',
        sortable: false,
        width: 100,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.checkListCodeTypeTpl
      },
      {
        name: 'วันที่ทำรายการ',
        prop: 'createdDate',
        sortable: false,
        width: 100,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
        cellTemplate: this.transactionDateTpl,
      },
      {
        name: 'สถานะ',
        prop: 'isActive',
        sortable: false,
        width: 80,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.statusTpl,
      },
    ] as GridTableColumn<UserCheckListsDTO>[];

    if (this.canCreate) {
      temp.push({
        name: '', prop: '_action',
        cellTemplate: this.grid.actionTpl,
        minWidth: 80, width: 100,
        sortable: false,
        canAutoResize: false,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
      });
    }
    this.columns = temp;
  }

  // add() {
  //   console.log('modal is open');
  //   this.regulatoryForm.open();
  // }

  save() {
    this.page.page = 1;
    this.getData();
    this.modal.close();
  }


  delete(item) {
    this.popupService.confirm(`ยืนยันการลบ`, ` คุณต้องการที่จะลบ "${item?.firstName}  ${item?.lastName}" หรือไม่?`, `danger`)
      .subscribe((res) => {
        if (res) {
          this.spinner.show('global');
          this.userChecklistService.userCheckListIdDelete$(item.id).subscribe(() => {
            this.toastrService.success('Delete success.');
            this.page.page = 1;
            this.getData();
            this.spinner.hide('global');
          });
        } else {
          this.page.page = 1;
          this.getData();
        }
      });
  }

  detail(item) {
    this.router.navigate([`./customer/list/profile/${item.id}`]);
  }

  protected getData() {

    console.log('this, filter', this.filterType);
    this.spinner.show('global');

    console.log('type', this.filterType);
    this.userChecklistService.userCheckListGet$(
      'CDD_CHECKLIST',
      this.filterCode?.name || undefined,
      undefined,
      undefined,
      undefined,
      'ASC',
      this.page.page,
      this.page.perPage,
      'id',
      this.filterType ? this.filterType.name : undefined,
      this.filterSearch,
      this.filterStatus === true ? true : this.filterStatus === false ? false : undefined
    ).subscribe((data) => {
      this.rows = data.userCheckLists;
      this.page.totalCount = data.pagination.allRecord;
      console.log('CDD', this.rows);
      this.spinner.hide('global');

    });

  }

  onClearFilter() {
    this.clearFilter.emit();
  }


}
