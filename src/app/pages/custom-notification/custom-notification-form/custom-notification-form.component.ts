import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ModalComponent, PnStorageService } from '@postnerd-core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CheckPermissionService, CustomNotificationsService, DocumentFileService } from '@api';
import { CustomNotificationsDTO, DocumentFileDTO } from '@model';
import * as _ from 'lodash';
import { PermissionEnum } from "@app/core/variables/permission.enum";

interface DocumentFileCustom extends DocumentFileDTO {
  isAllow?: boolean;
}

@Component({
  selector: 'custom-notification-form',
  templateUrl: './custom-notification-form.component.html',
  styleUrls: ['./custom-notification-form.component.scss']
})
export class CustomNotificationFormComponent implements OnInit, OnChanges {

  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('customerModal') customerModal: ModalComponent;
  @ViewChild('agentModal') agentModal: ModalComponent;

  @Input() customNotiPublishId;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  canCreate: boolean;
  canView: boolean;

  customNotificationId: string;
  customNotificationsData: CustomNotificationsDTO = {} as CustomNotificationsDTO;
  customNotificationsPublishData: CustomNotificationsDTO = {} as CustomNotificationsDTO;
  customType: any;

  fileList: DocumentFileCustom[] = [];

  isPublishAgent = false;
  isPublishCustomer = false;
  isInvalidFile = false;
  isInvalidTitle = false;
  isInvalidCustomer = false;
  isInvalidAgent = false;

  customer = 1;
  agent = 1;
  balanceSelectList = [];
  originalSelectList = [];
  agentSelectList = [];
  userIdSelectList = [];
  agentActionType: string;
  customerActionType: string;


  listType = [
    { id: 1, name: 'ประกาศจาก เทรเชอริสต์', value: 'TSR' },
    { id: 2, name: 'ประกาศจาก ก.ล.ต.', value: 'SEC' },
    { id: 3, name: 'ประกาศจาก บลจ.', value: 'AMC' },
  ];

  customerList = [
    { value: 1, label: 'ลูกค้าทั้งหมด' },
    { value: 0, label: 'ระบุลูกค้า' }
  ];

  agentList = [
    { value: 1, label: 'Agent ทั้งหมด' },
    { value: 0, label: 'ระบุ Agent' }
  ];

  isCustomer = false;
  isAgent = false;
  isAllAgent = false;
  isCustomAgent = false;
  isCustomCustomer = false;
  isAllCustomer = false;


  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private customNotificationsService: CustomNotificationsService,
    private documentFileService: DocumentFileService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.customNotiPublishId) {
      this.getCustomNotificationDataWhenPublish();
    }
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
      this.getCustomNotificationData();
    }

  }

  getCustomNotificationData() {
    this.spinner.show('global');
    // this.fileList = [];
    this.customNotificationsService.customNotificationsIdGet$(_.toNumber(this.customNotificationId)).subscribe(
      data => {
        console.log('dataa issss', data);
        this.customNotificationsData = data;

        // SET DATA

        if (this.customNotificationsData.type === 'TSR') {
          this.customType = { id: 1, name: 'ประเภทจาก เทรเชอริสต์', value: 'TSR' };
        } else if (this.customNotificationsData.type === 'SEC') {
          this.customType = { id: 2, name: 'ประเภทจาก ก.ล.ต.', value: 'SEC' };
        } else if (this.customNotificationsData.type === 'AMC') {
          this.customType = { id: 3, name: 'ประเภทจาก บลจ.', value: 'AMC' };
        } else {
          this.customType = undefined;
        }

        if (this.customNotificationsData.isPublishCustomer) {
          this.isPublishCustomer = this.customNotificationsData.isPublishCustomer;
        }

        if (this.customNotificationsData.isPublishAgent) {
          this.isPublishAgent = this.customNotificationsData.isPublishAgent;
        }

        if (this.customNotificationsData.documentFiles) {
          console.log('this.customNotificationsData.documentFiles', this.customNotificationsData.documentFiles);
          this.fileList = this.customNotificationsData.documentFiles;
          for (const file of this.customNotificationsData.documentFiles) {
            const index = _.findIndex(this.fileList, i => i.id === file.id);
            console.log('index', index);
            this.fileList[index].isAllow = true;
          }
          this.fileList = this.customNotificationsData.documentFiles;
          console.log(' this.fileList', this.fileList);
        }

        if (this.customNotificationsData.isPublishCustomer === false) {
          this.isCustomer = false;
          this.isCustomCustomer = false;
          this.isAllCustomer = false;

          if (this.customNotificationsData.balanceIds) {
            const convertJson = this.customNotificationsData.balanceIds.split(',');
            const balanceIdList = [];
            convertJson.forEach(balanceId => {
              balanceIdList.push({ balanceId: _.toNumber(balanceId) });
            });

            console.log('balanceSelectList', balanceIdList);
            this.balanceSelectList = balanceIdList;
            this.isCustomCustomer = true;
            this.isCustomer = true;
          }

          if (this.customNotificationsData.customerUserIds) {
            const convertJsonCustomerId = this.customNotificationsData.customerUserIds.split(',');
            const userIdList = [];
            convertJsonCustomerId.forEach(customerUserIds => {
              userIdList.push({ userId: _.toNumber(customerUserIds) });
            });

            this.userIdSelectList = userIdList;
            console.log('userIdList', this.userIdSelectList);
          }


        } else if (this.customNotificationsData.isPublishCustomer === true) {
          this.isCustomer = false;
          this.isCustomCustomer = false;
          this.isAllCustomer = true;
        }

        if (this.customNotificationsData.isPublishAgent === false) {
          this.isAgent = false;
          this.isCustomAgent = false;
          this.isAllAgent = false;
          if (this.customNotificationsData.agentUserIds) {
            const convertJson = this.customNotificationsData.agentUserIds.split(',');
            const agentIdList = [];
            convertJson.forEach(agent => {
              agentIdList.push({ user: { id: _.toNumber(agent) } });
            });

            console.log('agentIdList', agentIdList);
            this.agentSelectList = agentIdList;
            this.isCustomAgent = true;
            this.isAgent = true;
          }


        } else if (this.customNotificationsData.isPublishAgent === true) {
          this.isAgent = false;
          this.isCustomAgent = false;
          this.isAllAgent = true;
        }

        this.spinner.hide('global');
      });
  }

  getCustomNotificationDataWhenPublish() {
    this.spinner.show('global');
    // this.fileList = [];
    this.customNotificationsService.customNotificationsIdGet$(_.toNumber(this.customNotiPublishId)).subscribe(
      data => {
        console.log('dataa issss', data);
        this.customNotificationsPublishData = data;

        console.log('customNotificationsPublishData', this.customNotificationsPublishData);

        // SET DATA

        if (this.customNotificationsPublishData.type === 'TSR') {
          this.customType = { id: 1, name: 'ประกาศจาก เทรเชอริสต์', value: 'TSR' };
        } else if (this.customNotificationsPublishData.type === 'SEC') {
          this.customType = { id: 2, name: 'ประกาศจาก ก.ล.ต.', value: 'SEC' };
        } else if (this.customNotificationsPublishData.type === 'AMC') {
          this.customType = { id: 3, name: 'ประกาศจาก บลจ.', value: 'AMC' };
        } else {
          this.customType = undefined;
        }

        if (this.customNotificationsPublishData.isPublishCustomer) {
          this.isPublishCustomer = this.customNotificationsPublishData.isPublishCustomer;
        }

        if (this.customNotificationsPublishData.isPublishAgent) {
          this.isPublishAgent = this.customNotificationsPublishData.isPublishAgent;
        }

        if (this.customNotificationsPublishData.documentFiles) {
          this.fileList = this.customNotificationsPublishData.documentFiles;
          for (const file of this.customNotificationsPublishData.documentFiles) {
            const index = _.findIndex(this.fileList, i => i.id === file.id);
            console.log('index', index);
            this.fileList[index].isAllow = true;
          }
          // this.fileList = this.customNotificationsPublishData.documentFiles;
          console.log(' this.fileList', this.fileList);
        }

        if (this.customNotificationsPublishData.isPublishCustomer === false) {
          if (this.customNotificationsPublishData.balanceIds) {
            const convertJson = this.customNotificationsPublishData.balanceIds.split(',');
            const balanceIdList = [];
            convertJson.forEach(balanceId => {
              balanceIdList.push({ balanceId: _.toNumber(balanceId) });
            });

            console.log('balanceSelectList', balanceIdList);
            this.balanceSelectList = balanceIdList;
          }

          if (this.customNotificationsPublishData.customerUserIds) {
            const convertJsonCustomerId = this.customNotificationsPublishData.customerUserIds.split(',');
            const userIdList = [];
            convertJsonCustomerId.forEach(customerUserIds => {
              userIdList.push({ customerUserIds: _.toNumber(customerUserIds) });
            });

            console.log('userIdList', userIdList);
            this.originalSelectList = userIdList;
          }


        }

        if (this.customNotificationsPublishData.isPublishAgent === false) {
          if (this.customNotificationsPublishData.agentUserIds) {
            const convertJson = this.customNotificationsPublishData.agentUserIds.split(',');
            const agentIdList = [];
            convertJson.forEach(agent => {
              agentIdList.push({ id: _.toNumber(agent) });
            });

            console.log('agentIdList', agentIdList);
            this.agentSelectList = agentIdList;
          }


        }

        this.spinner.hide('global');
      });
  }

  onChangeType(item) {
    console.log('cutom type', item);
    if (item) {
      this.customNotificationsData.type = item.value;
    }
  }

  onChangeIspublish(event, type) {
    if (event && type === 'customer') {
      this.customNotificationsData.isPublishCustomer = event;
    } else if (event && type === 'agent') {
      this.customNotificationsData.isPublishAgent = event;
    }
  }

  onSaveDraft() {
    this.spinner.show('global');

    this.isInvalidTitle = false;

    if (!this.customNotificationsData.title) {
      this.isInvalidTitle = true;
      this.spinner.hide('global');
      return;
    } else {
      // SET DATA
      this.customNotificationsData.status = 'Draft';
      if (!_.isEmpty(this.fileList)) {
        console.log('file listttt ', this.fileList);
        const groupByAllow = _.groupBy(this.fileList, 'isAllow');
        const selectAllowData = groupByAllow.true;
        const docFiles = [];
        if (selectAllowData) {
          selectAllowData.forEach(item => {
            console.log('item iss', item.id);
            docFiles.push(item.id);
          });
          this.customNotificationsData.docFiles = docFiles.toString();
        }
      } else {
        this.customNotificationsData.docFiles = null;
      }

      if (_.isNil(this.customNotificationsData.isPublishCustomer)) {
        this.customNotificationsData.isPublishCustomer = false;
      } else {
        this.customNotificationsData.isPublishCustomer = this.customNotificationsData.isPublishCustomer;
      }

      if (_.isNil(this.customNotificationsData.isPublishAgent)) {
        this.customNotificationsData.isPublishAgent = false;
      } else {
        this.customNotificationsData.isPublishAgent = this.customNotificationsData.isPublishAgent;
      }

      if (this.isCustomCustomer === true) {
        console.log('this.ciutomerList', this.balanceSelectList);

        if (this.balanceSelectList.length === 0) {
          console.log('Chcek เมื่อ balancelist .lenngth === 0');
          this.customNotificationsData.balanceIds = null;
          this.customNotificationsData.customerUserIds = null;

        } else {
          console.log('Chcek เมื่อ balancelist .lenngth !== 0');
          const uniqByUserId = _.uniqBy(this.balanceSelectList, 'userId');
          const uniqByBalanceId = _.uniqBy(this.balanceSelectList, 'balanceId');

          console.log('uniqByUserId', uniqByUserId);
          console.log('uniqBybalanceId', uniqByBalanceId);
          console.log('this.customNotificationsData.customerUserIds', this.customNotificationsData.customerUserIds);

          const userIdData = [];
          const balanceIdData = [];

          if (uniqByBalanceId.length > 0) {
            uniqByBalanceId.forEach(item => {
              balanceIdData.push(item.balanceId);
            });
            this.customNotificationsData.balanceIds = balanceIdData.toString();
          }

          if (uniqByUserId.length > 0) {
            uniqByUserId.forEach(item => {
              console.log('_.isNil(item.userId)', !_.isNil(item.userId));
              if (!_.isNil(item.userId)) {
                this.userIdSelectList.push({ userId: item.userId });
              }
            });
          }

          console.log('userIdSelectList', this.userIdSelectList);

          if (this.customNotificationsData.customerUserIds) {
            // this.
            // const customerUserArray = this.customNotificationsData.customerUserIds.split(',');
            const customerUserArray = [];
            if (this.userIdSelectList.length > 0) {
              this.userIdSelectList.forEach(item => {
                if (item) {
                  customerUserArray.push(_.toString(item.userId));
                }
              });

              const uniqUserId = _.uniq(customerUserArray);
              console.log('uniqUserId', uniqUserId);
              this.customNotificationsData.customerUserIds = uniqUserId.toString();
              console.log('this.customNotificationsData.customerUserIds ', this.customNotificationsData.customerUserIds);
            }
          } else {
            const customerUserArray = [];
            if (this.userIdSelectList.length > 0) {
              this.userIdSelectList.forEach(item => {
                if (item) {
                  customerUserArray.push(_.toString(item.userId));
                }
              });

              const uniqUserId = _.uniq(customerUserArray);
              console.log('uniqUserId', uniqUserId);
              this.customNotificationsData.customerUserIds = uniqUserId.toString();
              console.log('เลือกใหม่');
            }

          }
        }
      }

      if (this.isCustomAgent === true) {
        console.log('this.agentList', this.agentSelectList);
        const agentIdList = [];
        this.agentSelectList.forEach(agent => {
          agentIdList.push(agent.user.id);
        });
        console.log('agentIdList', agentIdList);

        this.customNotificationsData.agentUserIds = agentIdList.toString();
      }

      console.log('customNotificationsData', this.customNotificationsData);


      // SERVICE

      if (this.customNotificationId) {
        this.customNotificationsService.customNotificationsIdPut$(_.toNumber(this.customNotificationId), this.customNotificationsData).subscribe(data => {
          console.log('draftt ', data);
          this.router.navigate([`./custom-notification`]);
          this.spinner.hide('global');
        });
      } else {
        this.customNotificationsService.customNotificationsPost$(this.customNotificationsData).subscribe(data => {
          console.log('draftt ', data);
          this.router.navigate([`./custom-notification`]);
          this.spinner.hide('global');
        });
      }


      console.log('dattaa save draft', this.customNotificationsData);
    }
  }

  onSave(form) {

    this.spinner.show('global');
    this.isInvalidTitle = false;
    this.isInvalidCustomer = false;
    this.isInvalidAgent = false;

    // CHECK VALID CUSTOMER

    // if (this.isCustomCustomer === false && this.isAllCustomer === false) {
    //   console.log('isInvalidCustomer', this.isCustomCustomer === false && this.isAllCustomer === false);
    //   this.isInvalidCustomer = true;
    // }
    //
    // if (this.isCustomAgent === false && this.isAllAgent === false) {
    //   this.isInvalidAgent = true;
    // }

    // SET File
    if (!_.isEmpty(this.fileList)) {
      console.log('file listttt ', this.fileList);
      const groupByAllow = _.groupBy(this.fileList, 'isAllow');
      const selectAllowData = groupByAllow.true;
      const docFiles = [];
      if (selectAllowData) {
        console.log('selectAllowData', selectAllowData);
        selectAllowData.forEach(item => {
          console.log('item iss', item.id);
          docFiles.push(item.id);
        });
        this.customNotificationsData.docFiles = docFiles.toString();
      } else {
        console.log('no selectAllowData', selectAllowData);
        this.customNotificationsData.docFiles = null;
      }
    } else {
      this.customNotificationsData.docFiles = null;
    }

    if (_.isNil(this.customNotificationsData.isPublishCustomer)) {
      this.customNotificationsData.isPublishCustomer = false;
    } else {
      this.customNotificationsData.isPublishCustomer = this.customNotificationsData.isPublishCustomer;
    }

    if (_.isNil(this.customNotificationsData.isPublishAgent)) {
      this.customNotificationsData.isPublishAgent = false;
    } else {
      this.customNotificationsData.isPublishAgent = this.customNotificationsData.isPublishAgent;
    }

    if (this.isCustomCustomer === true) {
      if (this.balanceSelectList.length === 0) {
        console.log('Chcek เมื่อ balancelist .lenngth === 0');
        this.customNotificationsData.balanceIds = null;
        this.customNotificationsData.customerUserIds = null;

      } else {
        console.log('Chcek เมื่อ balancelist .lenngth !== 0');
        const uniqByUserId = _.uniqBy(this.balanceSelectList, 'userId');
        const uniqByBalanceId = _.uniqBy(this.balanceSelectList, 'balanceId');

        console.log('uniqByUserId', uniqByUserId);
        console.log('uniqBybalanceId', uniqByBalanceId);
        console.log('this.customNotificationsData.customerUserIds', this.customNotificationsData.customerUserIds);

        const userIdData = [];
        const balanceIdData = [];

        if (uniqByBalanceId.length > 0) {
          uniqByBalanceId.forEach(item => {
            balanceIdData.push(item.balanceId);
          });
          this.customNotificationsData.balanceIds = balanceIdData.toString();
        }

        if (uniqByUserId.length > 0) {
          uniqByUserId.forEach(item => {
            console.log('_.isNil(item.userId)', !_.isNil(item.userId));
            if (!_.isNil(item.userId)) {
              this.userIdSelectList.push({ userId: item.userId });
            }
          });
        }

        console.log('userIdSelectList', this.userIdSelectList);

        if (this.customNotificationsData.customerUserIds) {
          // this.
          // const customerUserArray = this.customNotificationsData.customerUserIds.split(',');
          const customerUserArray = [];
          if (this.userIdSelectList.length > 0) {
            this.userIdSelectList.forEach(item => {
              if (item) {
                customerUserArray.push(_.toString(item.userId));
              }
            });

            const uniqUserId = _.uniq(customerUserArray);
            console.log('uniqUserId', uniqUserId);
            this.customNotificationsData.customerUserIds = uniqUserId.toString();
            console.log('this.customNotificationsData.customerUserIds ', this.customNotificationsData.customerUserIds);
          }
        } else {
          const customerUserArray = [];
          if (this.userIdSelectList.length > 0) {
            this.userIdSelectList.forEach(item => {
              if (item) {
                customerUserArray.push(_.toString(item.userId));
              }
            });

            const uniqUserId = _.uniq(customerUserArray);
            console.log('uniqUserId', uniqUserId);
            this.customNotificationsData.customerUserIds = uniqUserId.toString();
            console.log('เลือกใหม่');
          }

        }
      }
    } else {
      this.customNotificationsData.balanceIds = null;
      this.customNotificationsData.customerUserIds = null;
    }

    if (this.isCustomAgent === true) {
      console.log('this.agentList', this.agentSelectList);
      const agentIdList = [];

      if (this.customNotificationsData.agentUserIds) {
        this.agentSelectList.forEach(agent => {
          agentIdList.push(agent.user.id);
        });
        console.log('agentIdList', agentIdList);

        this.customNotificationsData.agentUserIds = agentIdList.toString();
      } else {
        this.agentSelectList.forEach(agent => {
          agentIdList.push(agent.user.id);
        });
        console.log('agentIdList', agentIdList);

        this.customNotificationsData.agentUserIds = agentIdList.toString();
      }


    } else {
      this.customNotificationsData.agentUserIds = null;
    }


    // console.log('fileList', this.fileList);
    console.log('this.customNotificationsData.docFiles', this.customNotificationsData.docFiles);

    // check Valid File
    // if (!this.customNotificationsData.docFiles) {
    //   this.isInvalidFile = true;
    // }

    if (this.isCustomCustomer === false && this.isAllCustomer === false) {
      console.log('ไม่กดลูกค้าทั้งหมด และ agent ทั้งหมด');
      this.isInvalidCustomer = true;
      // this.isInvalidAgent = true;
    }

    if (this.isCustomCustomer === true && !this.userIdSelectList?.length) {
      console.log('custom customer no list');
      this.isInvalidCustomer = true;
    }
    if (this.isCustomAgent === true && !this.agentSelectList?.length) {
      console.log('custom agent no list');
      this.isInvalidAgent = true;
    }
    // else if () {
    // !this.userIdSelectList?.length && !this.agentSelectList?.length
    //  }

    if (form.invalid || !this.customNotificationsData.type || this.isInvalidCustomer || this.isInvalidAgent) {
      this.spinner.hide('global');
      return;
    } else {
      // SET DATA
      this.customNotificationsData.status = 'Publish';

      // console.log('this.isPublishCustomer', this.isPublishCustomer);


      // SERVICE
      if (this.customNotificationId) {
        console.log('have id ');
        this.customNotificationsService.customNotificationsIdPut$(_.toNumber(this.customNotificationId), this.customNotificationsData).subscribe(data => {
          console.log('publish ', data);
          this.spinner.hide('global');
          this.router.navigate([`./custom-notification`]);
          console.log('dattaa save ', this.customNotificationsData);
        });
      } else {
        console.log('no id ');
        this.customNotificationsService.customNotificationsPost$(this.customNotificationsData).subscribe(data => {
          console.log('publish ', data);
          this.spinner.hide('global');
          this.router.navigate([`./custom-notification`]);
        });
        console.log('dattaa save ', this.customNotificationsData);
      }
    }

  }

  onSaveSelectFile(event) {
    console.log('event file save', event);
    if (event) {
      this.fileList = event;
      this.modal.close();
    }
  }

  onDeleteFile(file, index) {
    this.fileList.splice(index, 1);
    console.log('fileList', this.fileList);
  }

  onSaveSelectCustomer(customerArray) {
    console.log('customer', customerArray);
    if (customerArray) {
      this.isCustomer = true;
      this.balanceSelectList = customerArray;
      this.customerModal.close();
    }
  }

  onSaveSelectUser(userIdList) {
    console.log('userId', userIdList);
    this.userIdSelectList = userIdList;
  }

  onSaveSelectAgent(agentArray) {
    console.log('agentArray', agentArray);
    if (agentArray) {
      this.isAgent = true;
      this.agentSelectList = agentArray;
      this.agentModal.close();
    }
  }

  goBack() {
    this.router.navigate([`./custom-notification`]);
  }

  onOpenSelectFile(file) {
    this.isInvalidFile = false;
    console.log('file inform', file);
    this.fileList = file;
    console.log('fileList', this.fileList);
    this.modal.open();
  }

  editCustomer() {
    this.customerActionType = 'edit';
    this.customerModal.open();
  }

  editAgent() {
    this.agentActionType = 'edit';
    this.agentModal.open();
  }

  onClickCustomer(event, type) {
    this.isInvalidCustomer = false;
    this.isInvalidAgent = false;
    if (type === 'allCustomer') {
      this.isCustomCustomer = false;
      this.isAllCustomer = true;
      this.customNotificationsData.isPublishCustomer = true;
      console.log('this.customNotificationsData.isPublishCustomer = true');
      console.log('this.customNotificationsData.isPublishCustomer = true', this.customNotificationsData.isPublishCustomer);
    } else if (type === 'customCustomer') {
      this.isCustomCustomer = true;
      this.isAllCustomer = false;
      this.customNotificationsData.isPublishCustomer = false;
      console.log('this.customNotificationsData.isPublishCustomer = false');
      this.customerActionType = 'new';
      this.customerModal.open();
    }
  }


  onClickAgent(event, type) {
    this.isInvalidCustomer = false;
    this.isInvalidAgent = false;
    if (type === 'allAgent') {
      this.isCustomAgent = false;
      this.isAllAgent = true;
      this.customNotificationsData.isPublishAgent = true;
    } else if (type === 'customAgent') {
      this.isCustomAgent = true;
      this.isAllAgent = false;
      this.customNotificationsData.isPublishAgent = false;
      this.agentActionType = 'new';
      this.agentModal.open();
    }
  }


  onSaveWhenPublish(form) {
    console.log('customdata', this.customNotificationsPublishData);
    this.spinner.show('global');

    // SET File
    if (this.fileList) {
      console.log('file listttt ', this.fileList);
      const groupByAllow = _.groupBy(this.fileList, 'isAllow');
      const selectAllowData = groupByAllow.true;
      const docFiles = [];
      if (selectAllowData) {
        console.log('selectAllowData', selectAllowData);
        selectAllowData.forEach(item => {
          console.log('item iss', item.id);
          docFiles.push(item.id);
        });
        this.customNotificationsPublishData.docFiles = docFiles.toString();
      } else {
        console.log('no selectAllowData', selectAllowData);
        this.customNotificationsPublishData.docFiles = null;
      }
    }

    if (form.invalid || !this.customNotificationsPublishData.type) {
      this.spinner.hide('global');
      return;
    } else {
      // setData
      if (this.customNotificationsPublishData) {
        this.customNotificationsPublishData.id = null;
        this.customNotificationsPublishData.documentFiles = null;
        this.customNotificationsPublishData.referentNotiId = this.customNotiPublishId;

        this.customNotificationsService.customNotificationsPost$(this.customNotificationsPublishData).subscribe(data => {
          console.log('draftt ', data);
          this.save.emit(form);
          this.spinner.hide('global');
        });
        console.log('dattaa save draft', this.customNotificationsPublishData);

      }
    }
  }

  onCancel() {
    this.cancel.emit();
  }


}
