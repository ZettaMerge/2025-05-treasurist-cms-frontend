import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomNotificationsDTO} from '@model';
import {NgxSpinnerService} from 'ngx-spinner';
import {CheckPermissionService, CustomNotificationsService} from '@api';
import * as _ from 'lodash';
import {BaseFeatureTabComponent, ModalComponent, PnStorageService} from '@postnerd-core';
import {PermissionEnum} from "@app/core/variables/permission.enum";

enum Tab {
  customer = 1,
  agent = 2,
}
@Component({
  selector: 'custom-notification-detail',
  templateUrl: './custom-notification-detail.component.html',
  styleUrls: ['./custom-notification-detail.component.scss']
})
export class CustomNotificationDetailComponent extends BaseFeatureTabComponent implements OnInit {

  @ViewChild('customNotiFormModal') customNotiFormModal: ModalComponent;
  customNotificationId: string;
  Tab = Tab;

  tabs = [
    {name: 'รายชื่อลูกค้า', id: Tab.customer},
    {name: 'รายชื่อ Agent', id: Tab.agent},
  ];

  customNotificationsData: CustomNotificationsDTO = {} as CustomNotificationsDTO;

  canCreate: boolean;
  canView: boolean;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private customNotificationsService: CustomNotificationsService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
    super(route);
  }

  ngOnInit(): void {
    // CHECK PERMISSION
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.CustomNotification).then(result => {
      if (result) {
        this.canCreate = result.canCreate;
        this.canView = result.canView;
      }

      console.log('result', result);
    });

    this.customNotificationId = this.route.snapshot.paramMap.get('id');
    if (this.customNotificationId) {
      this.getCustomNotificationById();
    }
  }

  getCustomNotificationById() {
    this.spinner.show('global');

    this.customNotificationsService.customNotificationsIdGet$(_.toNumber(this.customNotificationId)).subscribe(
      data =>  {
        console.log('dataa issss', data);
        this.customNotificationsData = data;
        this.spinner.hide('global');
      });
  }

  onSaveCustomNoti(event) {
    if (event) {
      this.customNotiFormModal.close();
      this.getCustomNotificationById();
    }
  }

  onOpenFormModal() {
    this.customNotiFormModal.open();
  }

  goBack() {
    this.router.navigate([`./custom-notification`]);
  }

  onGoReferentOrReferFrom(id) {
    const url = `custom-notification/detail/${id}`;
    window.open(url, '_blank');
  }

}
