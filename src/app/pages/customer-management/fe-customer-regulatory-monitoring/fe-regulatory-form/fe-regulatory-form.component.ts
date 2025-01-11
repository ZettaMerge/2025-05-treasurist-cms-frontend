import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserCheckListDTO} from '@model';
import {UserChecklistService} from '@api';
import * as moment from 'moment';

@Component({
  selector: 'fe-regulatory-form',
  templateUrl: './fe-regulatory-form.component.html',
  styleUrls: ['./fe-regulatory-form.component.scss'],
})
export class FeRegulatoryFormComponent implements OnInit {

  @Input() regulatoryData;
  @Input() isNew;
  @Input() regulatoryType: string;

  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  status = 1;
  typeCdd = 1;
  typeAmlo = 1;
  type = 1;
  cddCode: any;
  code: any;

  checkListTypes = [
    {id: 1, name: 'CDD List', isAllow: false},
    {id: 2, name: 'PEP List', isAllow: false},
    {id: 3, name: 'AMLO', isAllow: false},
  ];

  listsDropdown = [
    {id: 1, name: 'HR-02'},
    {id: 2, name: 'HR-08-RISK'},
  ];

  typeCddCodeHr2 = [
    {value: 1, label: '1'},
  ];

  typeCddCodeRh8 = [
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
  ];

  typeCddCode = [
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
  ];

  typeAmloList = [
    {value: 1, label: 'Thailand List'},
    {value: 2, label: 'UN List'},
  ];

  statusList = [
    {value: 1, label: 'Active'},
    {value: 2, label: 'Inactive'},
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private userChecklistService: UserChecklistService,
  ) {
  }

  ngOnInit(): void {
    if (this.isNew) {
      this.regulatoryData = {} as UserCheckListDTO;
      console.log('isnee');
      console.log('regulatoryType', this.regulatoryType);
    } else {
      // this.getDataById();
      this.setData();
      console.log('UserCheckListDTO', this.regulatoryData);
    }
  }

  onSelectType(event, checkListType, index) {
    console.log('event', event);
    this.checkListTypes[index].isAllow = event;
    console.log('checkListTypes', this.checkListTypes);
  }

  getDataById() {

    this.userChecklistService.userCheckListIdGet$(this.regulatoryData.id).subscribe(data => {
      console.log('data isss', data);
    });
    console.log('data isss');
  }

  setData() {

    // set CDD
    if (this.regulatoryType === 'cdd') {

      this.status = this.regulatoryData.isActive === true ? 1 : 2;

      if (this.regulatoryData.code === 'HR-02') {
        this.code = {id: 1, name: 'HR-02'};
        this.cddCode = {id: 1, name: 'HR-02'};
        this.typeCdd = 1;
      } else {

        this.code = {id: 2, name: 'RH-08-RISK'};
        this.cddCode = {id: 2, name: 'RH-08-RISK'};

        if (this.regulatoryData.type === '2') {
          this.typeCdd = 2;
        } else if (this.regulatoryData.type === '3') {
          this.typeCdd = 3;
        } else {
          this.typeCdd = 4;
        }

      }

      this.regulatoryData.type = this.typeCdd.toString();

      if (this.regulatoryData.birthdate) {
        const birthDate = moment(this.regulatoryData.birthdate).format('YYYY-MM-DD');
        this.regulatoryData.birthdate = birthDate + 'T02:18:39.986Z';
      }

      console.log('date', this.regulatoryData);
    } else if (this.regulatoryType === 'pep') {
      this.status = this.regulatoryData.isActive === true ? 1 : 2;
      if (this.regulatoryData.birthdate) {
        const birthDate = moment(this.regulatoryData.birthdate).format('YYYY-MM-DD');
        this.regulatoryData.birthdate = birthDate + 'T02:18:39.986Z';
      }
    } else {
      this.status = this.regulatoryData.isActive === true ? 1 : 2;
      this.typeAmlo = this.regulatoryData.type === 'Thailand List' ? 1 : 2;
      if (this.regulatoryData.birthdate) {
        const birthDate = moment(this.regulatoryData.birthdate).format('YYYY-MM-DD');
        this.regulatoryData.birthdate = birthDate + 'T02:18:39.986Z';
      }
    }
  }

  onSave(form) {
    console.log('form', form);
    this.spinner.show('global');

    if (form.invalid) {
      console.log('valid');
      this.spinner.hide('global');
      return;
    } else {

      let req;
      if (this.isNew) {
        console.log('new');

        if (this.regulatoryType === 'cdd') {
          console.log('hello cdd');
          this.regulatoryData.isActive = this.status === 1 ? true : false;
          this.regulatoryData.code = this.code.name;
          this.regulatoryData.type = this.typeCdd.toString();

          if (this.regulatoryData.birthdate) {
            const birthDate = moment(this.regulatoryData.birthdate).format('YYYY-MM-DD');
            this.regulatoryData.birthdate = birthDate + 'T02:18:39.986Z';
          } else {
            this.regulatoryData.birthdate = null;
          }

          req = this.userChecklistService.userCheckListPost$(this.regulatoryData);

        } else if (this.regulatoryType === 'pep') {
          console.log('hello PEP');
          this.regulatoryData.isActive = this.status === 1 ? true : false;
          if (this.regulatoryData.birthdate) {
            const birthDate = moment(this.regulatoryData.birthdate).format('YYYY-MM-DD');
            this.regulatoryData.birthdate = birthDate + 'T02:18:39.986Z';
          } else {
            this.regulatoryData.birthdate = null;
          }

          req = this.userChecklistService.userCheckListPost$(this.regulatoryData);

        } else if (this.regulatoryType === 'amlo') {
          console.log('hello AMLO');
          this.regulatoryData.isActive = this.status === 1 ? true : false;
          this.regulatoryData.type = this.typeAmlo === 1 ? 'Thailand List' : 'Un List';
          if (this.regulatoryData.birthdate) {
            const birthDate = moment(this.regulatoryData.birthdate).format('YYYY-MM-DD');
            this.regulatoryData.birthdate = birthDate + 'T02:18:39.986Z';
          } else {
            this.regulatoryData.birthdate = null;
          }

          req = this.userChecklistService.userCheckListPost$(this.regulatoryData);
        }

        req.subscribe(data => {
          console.log('this.regulatoryData', data);
          this.spinner.hide('global');
          this.save.emit();

        });

      } else {
        console.log('edit');
        if (this.regulatoryType === 'cdd') {
          console.log('hello cdd');
          this.regulatoryData.isActive = this.status === 1 ? true : false;
          this.regulatoryData.code = this.code.name;
          this.regulatoryData.type = this.typeCdd.toString();
          if (this.regulatoryData.birthdate) {
            const birthDate = moment(this.regulatoryData.birthdate).format('YYYY-MM-DD');
            this.regulatoryData.birthdate = birthDate + 'T02:18:39.986Z';
          } else {
            this.regulatoryData.birthdate = null;
          }

          req = this.userChecklistService.userCheckListIdPut$(this.regulatoryData.id, this.regulatoryData);

        } else if (this.regulatoryType === 'pep') {
          console.log('hello PEP');
          this.regulatoryData.isActive = this.status === 1 ? true : false;
          if (this.regulatoryData.birthdate) {
            const birthDate = moment(this.regulatoryData.birthdate).format('YYYY-MM-DD');
            this.regulatoryData.birthdate = birthDate + 'T02:18:39.986Z';
          } else {
            this.regulatoryData.birthdate = null;
          }

          req = this.userChecklistService.userCheckListIdPut$(this.regulatoryData.id, this.regulatoryData);

        } else if (this.regulatoryType === 'amlo') {
          console.log('hello AMLO');
          this.regulatoryData.isActive = this.status === 1 ? true : false;
          this.regulatoryData.type = this.typeAmlo === 1 ? 'Thailand List' : 'Un List';
          if (this.regulatoryData.birthdate) {
            const birthDate = moment(this.regulatoryData.birthdate).format('YYYY-MM-DD');
            this.regulatoryData.birthdate = birthDate + 'T02:18:39.986Z';
          } else {
            this.regulatoryData.birthdate = null;
          }

          req = this.userChecklistService.userCheckListIdPut$(this.regulatoryData.id, this.regulatoryData);
        }

        req.subscribe(data => {
          console.log('this.regulatoryData', data);
          this.spinner.hide('global');
          this.save.emit();

        });
      }
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  checkList(cddCode) {
    console.log('codee', cddCode);
    if (cddCode && cddCode.id === 1) {
      this.cddCode = cddCode;
      this.typeCdd = 1;
    } else {
      this.cddCode = cddCode;
      this.typeCdd = 2;
    }

  }

}
