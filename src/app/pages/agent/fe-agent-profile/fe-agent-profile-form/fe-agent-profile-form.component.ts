import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AgentService, CheckPermissionService} from '@api';
import {AddressDTO, AgentDTO, BankDTO, TeamDTO, UserInAgentDTO} from '@model';
import * as moment from 'moment';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import * as _ from 'lodash';
import {PnStorageService, PopupService} from '@postnerd-core';
import {PermissionEnum} from "@app/core/variables/permission.enum";

@Component({
  selector: 'fe-agent-profile-form',
  templateUrl: './fe-agent-profile-form.component.html',
  styleUrls: ['./fe-agent-profile-form.component.scss']
})
export class FeAgentProfileFormComponent implements OnInit {

  agentData: AgentDTO = {} as AgentDTO;
  agentUserData: UserInAgentDTO = {} as UserInAgentDTO;
  agentAddressData: AddressDTO = {} as AddressDTO;
  bankData: BankDTO = {} as BankDTO;
  teamData: TeamDTO = {} as TeamDTO;

  canCreate: boolean;

  isEmailError: boolean;
  isIcLicenseError: boolean;
  birthDate: any;
  inactiveDate: any;
  licenseExpireDate: any;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    protected agentService: AgentService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private popupService: PopupService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
  }

  ngOnInit(): void {
    // this.openAccountId = this.route.snapshot.paramMap.get('id');
  }

  onSave(form) {

    this.isEmailError = false;

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

    if (_.isNil(this.agentData.isTeamLeader)) {
      this.agentData.isTeamLeader = false;
    } else {
      this.agentData.isTeamLeader = this.agentData.isTeamLeader;
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

    this.agentData.addresses = [this.agentAddressData];
    this.agentData.user = this.agentUserData;

    if (form.invalid) {
      this.spinner.hide('global');
      return;
    } else {

      this.spinner.hide('global');
      this.popupService.confirm(``, `เมื่อกดสร้าง Agent ระบบจะส่งอีเมลแจ้งเตือนไปยังผู้ใช้งานอัตโนมัติ`, `primary`)
        .subscribe((data) => {

          if (data) {
            this.spinner.show('global');
            this.agentService.agentPost$(this.agentData).subscribe(agent => {
                this.spinner.hide('global');
                this.router.navigate([`./agent/profile`]);
              },
              (error) => {
                console.log('error save', error);
                this.spinner.hide('global');
                if (error && error.error) {
                  const errors = JSON.parse(error.error);
                  if (errors.errorCode === 'DT4002') {
                    if (errors.er === 'Email is already exist.') {
                      this.isEmailError = true;
                      this.toastrService.error(`${errors.errorMessage}`);
                    } else {
                      this.isIcLicenseError = true;
                      this.toastrService.error(`${errors.errorMessage}`);
                    }

                  } else if (errors.errorCode !== 'DT4002') {
                    this.isEmailError = false;
                    this.toastrService.error(`${errors.errorMessage}`);
                  }
                }
              });
          } else {
            this.spinner.hide('global');
            this.router.navigate([`./agent/profile`]);
          }
        });
    }

// console.log('dateType', dateType);
    console.log('this.agentData', this.agentData);

  }

  goBack() {
    this.router.navigate([`./agent/profile`]);
  }

}
