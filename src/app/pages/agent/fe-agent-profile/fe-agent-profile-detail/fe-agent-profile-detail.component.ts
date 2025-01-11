import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AgentService, CheckPermissionService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import {AddressDTO, AgentDTO, BankDTO, TeamDTO, UserInAgentDTO} from '@model';
import * as _ from 'lodash';
import {add} from 'ngx-bootstrap/chronos';
import * as moment from 'moment';
import {PnStorageService} from "@postnerd-core";
import {PermissionEnum} from "@app/core/variables/permission.enum";

@Component({
  selector: 'fe-agent-profile-detail',
  templateUrl: './fe-agent-profile-detail.component.html',
  styleUrls: ['./fe-agent-profile-detail.component.scss']
})
export class FeAgentProfileDetailComponent implements OnInit {

  isAgentDetail = true;
  agentId: string;
  mode: string;
  canView: boolean;
  canCreate: boolean;

  agentData: AgentDTO = {} as AgentDTO;
  agentUserData: UserInAgentDTO = {} as UserInAgentDTO;
  agentAddressData: AddressDTO = {} as AddressDTO;
  bankData: BankDTO = {} as BankDTO;
  teamData: TeamDTO = {} as TeamDTO;

  birthDate: any;
  inactiveDate: any;
  licenseExpireDate: any;


  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    protected agentService: AgentService,
    private spinner: NgxSpinnerService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
  }

  ngOnInit(): void {
    this.agentId = this.route.snapshot.paramMap.get('id');
    this.mode = this.route.snapshot.paramMap.get('mode');

    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.AgentProfile).then(result => {
      if (result) {
        this.canView = result.canView;
        this.canCreate = result.canCreate;
      }
      console.log('this.canView', this.canView);
      console.log('this.canCreate', this.canCreate);
    });

    if (this.agentId) {
      this.getAgentById();
    }
  }

  getAgentById() {
    this.spinner.show('global');

    this.agentService.agentIdGet$(_.toNumber(this.agentId)).subscribe(data => {
      this.agentData = data;
      this.agentUserData = data.user;
      this.bankData = data.bank;
      this.teamData = data.team;
      const addresArr = data.addresses;

      for (const address of addresArr) {
        this.agentAddressData.country = address.country;
        this.agentAddressData.building = address.building;
        this.agentAddressData.city = address.city;
        this.agentAddressData.district = address.district;
        this.agentAddressData.floor = address.floor;
        this.agentAddressData.houseNo = address.houseNo;
        this.agentAddressData.moo = address.moo;
        this.agentAddressData.postalCode = address.postalCode;
        this.agentAddressData.refText = address.refText;
        this.agentAddressData.road = address.road;
        this.agentAddressData.roomNo = address.roomNo;
        this.agentAddressData.soi = address.soi;
        this.agentAddressData.subDistrict = address.subDistrict;
        this.agentAddressData.type = address.type;
      }

      console.log('agentAddressData', this.agentAddressData);
      console.log('agentData', this.agentData);
      this.spinner.hide('global');
    });
  }

  onSave(form) {
    this.spinner.show('global');

    if (this.agentAddressData) {
      this.agentAddressData.country = 'TH';
      this.agentAddressData.type = 'CURRENT';
    }

    if (this.agentUserData.email) {
      this.agentUserData.username = this.agentUserData.email;
    }

    if (this.agentData.birthdate) {
      const bDate = moment(this.agentData.birthdate).toDate();
      this.birthDate = bDate.toISOString();
      console.log('date', this.birthDate);
      this.agentData.birthdate = this.birthDate;
    }

    if (this.agentData.inactiveDate) {
      const inactiveDate = moment(this.agentData.inactiveDate).toDate();
      this.inactiveDate = inactiveDate.toISOString();
      console.log('inactiveDate', this.inactiveDate);
      this.agentData.inactiveDate = this.inactiveDate;
    }

    if (this.agentData.licenseExpireDate) {
      const licenseDate = moment(this.agentData.licenseExpireDate).toDate();
      this.licenseExpireDate = licenseDate.toISOString();
      console.log('licenseExpireDate', this.licenseExpireDate);
      this.agentData.licenseExpireDate = this.licenseExpireDate;
    }

    if (_.isNil(this.agentData.isTeamLeader)) {
      this.agentData.isTeamLeader = false;
    } else {
      this.agentData.isTeamLeader = this.agentData.isTeamLeader;
    }

    this.agentData.addresses = [this.agentAddressData];
    this.agentData.user = this.agentUserData;

    if (form.invalid) {
      this.spinner.hide('global');
      return;
    } else {

      if (this.agentId) {
        this.agentService.agentPut$(_.toNumber(this.agentId), this.agentData).subscribe(data => {
          this.spinner.hide('global');
          this.router.navigate([`./agent/profile`]);
          console.log('data', data);
        });
      }
    }

    // console.log('dateType', dateType);
    console.log('this.agentData', this.agentData);

  }

  goToCustomerList() {
    const url = `./customer/list/${this.agentData.icLicense}/${this.agentData?.team?.id}`;
    window.open(url, '_blank');
  }

  goBack() {
    this.router.navigate([`./agent/profile`]);
  }

}
