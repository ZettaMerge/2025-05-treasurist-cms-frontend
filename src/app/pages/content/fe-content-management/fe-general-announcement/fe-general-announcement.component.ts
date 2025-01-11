import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {BaseFeatureGridComponent, GridTableColumn, PnStorageService} from '@postnerd-core';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {CheckPermissionService} from "@api";
import {PermissionEnum} from "@app/core/variables/permission.enum";

interface FilterType {
  search: string;
  dateRange: Date[];
}

@Component({
  selector: 'fe-general-announcement',
  templateUrl: './fe-general-announcement.component.html',
  styleUrls: ['./fe-general-announcement.component.scss']
})
export class FeGeneralAnnouncementComponent extends BaseFeatureGridComponent<any> implements OnInit {

  @ViewChild('startDateTpl', {static: true}) startDateTpl: TemplateRef<any>;
  @ViewChild('endDateTpl', {static: true}) endDateTpl: TemplateRef<any>;
  filter: FilterType = {} as FilterType;

  canCreate: boolean;
  canView: boolean;

  searchDebounce = _.debounce(
    () => {
      this.page.page = 1;
      this.getData();
    },
    1000,
    {leading: false, trailing: true}
  );

  dataSub: Subscription;

  constructor(
    private router: Router,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
    super();
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
        this.setColumns();
      }

      console.log('result ann list', result);
    });

    super.ngOnInit();
    this.getData();
  }

  goBack() {
    this.router.navigate([`./content-management`]);
  }

  edit(event) {
    this.router.navigate([`./content-management/announcement/${1}`]);
  }

  detail(event) {
    this.router.navigate([`./content-management/announcement/${1}`]);
  }

  goToCreateNewList() {
    this.router.navigate([`./content-management/announcement/new`]);
  }

  protected setColumns() {
    const temp = [
      {
        name: 'หัวข้อ',
        prop: 'tittle',
        width: 200,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'วันเวลาเริ่มต้น',
        prop: 'startDate',
        width: 100,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.startDateTpl,
      },
      {
        name: 'วันเวลาสิ้นสุด',
        prop: 'endDate',
        sortable: false,
        width: 100,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.endDateTpl,
      },
      {
        name: 'วันที่อัปเดต',
        prop: 'updateDate',
        width: 100,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
      {
        name: 'อัปเดตโดย',
        prop: 'updateBy',
        width: 200,
        sortable: false,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
      },
    ] as GridTableColumn<any>[];

    if (this.canView && !this.canCreate) {
      temp.push(
        {
          name: '', prop: '_action',
          cellTemplate: this.grid.detailTpl,
          minWidth: 80, width: 130,
          sortable: false,
          canAutoResize: false,
          cellClass: 'justify-content-center',
          headerClass: 'justify-content-center',
        });
    } else if (this.canCreate && this.canView || this.canCreate && !this.canView) {
      temp.push({
        name: '', prop: '_action',
        cellTemplate: this.grid.actionEditTpl,
        minWidth: 80, width: 130,
        sortable: false,
        canAutoResize: false,
        cellClass: 'justify-content-center',
        headerClass: 'justify-content-center',
      });
    }
    this.columns = temp;
  }

  protected getData() {
    // this.spinner.show('global');

    // if (this.dataSub) {
    //   this.dataSub.unsubscribe();
    // }

    this.rows = [
      {
        tittle: 'ประกาศขายกองทุนชั่วคราว',
        startDate: '20/08/2021',
        endDate: '20/08/2021',
        startTime: '10:00 น.',
        endTime: '18:00 น.',
        updateDate: '20/08/2021',
        updateBy: 'Firstname Lastname'
      },
      {
        tittle: 'ประกาศขายกองทุนชั่วคราว',
        startDate: '20/08/2021',
        endDate: '20/08/2021',
        startTime: '10:00 น.',
        endTime: '18:00 น.',
        updateDate: '20/08/2021',
        updateBy: 'Firstname Lastname'
      },
      {
        tittle: 'ประกาศขายกองทุนชั่วคราว',
        startDate: '20/08/2021',
        endDate: '20/08/2021',
        startTime: '10:00 น.',
        endTime: '18:00 น.',
        updateDate: '20/08/2021',
        updateBy: 'Firstname Lastname'
      },
      {
        tittle: 'ประกาศขายกองทุนชั่วคราว',
        startDate: '20/08/2021',
        endDate: '20/08/2021',
        startTime: '10:00 น.',
        endTime: '18:00 น.',
        updateDate: '20/08/2021',
        updateBy: 'Firstname Lastname'
      }
    ];
    this.page.totalCount = this.rows.length;
  }
}
