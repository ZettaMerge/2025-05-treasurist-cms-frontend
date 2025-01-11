import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {MasterBankService, TeamService} from '@api';
import {AddressDTO, TeamDTO} from "@model";

@Component({
  selector: 'profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class ProfileFormComponent implements OnInit, OnChanges {

  @Input() isAgentDetail;
  @Input() isEmailError;
  @Input() isIcLicenseError;
  @Input() agentData;
  @Input() agentUserData;
  @Input() agentAddressData: AddressDTO = {} as AddressDTO;
  @Input() bankData;
  @Input() agentTeamData;
  @Input() canView;
  @Input() canCreate;

  teamList: any;
  teamName: string;
  plainComplexFlag: any;
  teamData: TeamDTO = {} as TeamDTO;
  bankCode: any;

  isShowCreateTeam = false;
  plainList = [
    {id: 1, name: 'Plain', value: 'PLAIN'},
    {id: 2, name: 'Complex', value: 'COMPLEX'},
  ];


  constructor(
    private teamService: TeamService,
    protected dropdownBankService: MasterBankService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.isAgentDetail) {
      if (this.bankData) {
        this.agentData.bank = {};
        this.agentData.bank = {id: this.bankData.id};
        this.dropdownBankService.dropdownBankGet$().subscribe(data => {
          const findBankCode = data.find(bc => bc.bankCode === this.bankData?.bankCode);
          this.bankCode = findBankCode;
        });
      }

      if (this.agentTeamData) {

        console.log('team dataa isss', this.agentTeamData);
        this.agentData.team = {};
        this.agentData.team = {id: this.agentTeamData.id};
        // this.teamService.dropdownTeamGet$().subscribe(data => {
        //   const findTeamId = data.find(team => team.id === this.teamData.id);
        //   console.log('findTeamId', data);
        //   // this.agentData.team = {id: `${findTeamId.id}`};
        // });
      }

      if (this.agentData.plainComplexFlag && this.agentData.plainComplexFlag === 'PLAIN') {
        this.plainComplexFlag = {id: 1, name: 'Plain', value: 'PLAIN'};
      } else if (this.agentData.plainComplexFlag && this.agentData.plainComplexFlag === 'COMPLEX') {
        this.plainComplexFlag = {id: 2, name: 'Complex', value: 'COMPLEX'};
      }
    }
  }

  ngOnInit(): void {
    if (!this.isAgentDetail) {
      this.getTeamDropdown();
    }
  }

  onSaveCreateTeam() {
    if (this.teamData.name) {
      this.teamService.teamPost$(this.teamData).subscribe(data => {
        console.log('data', data);
        if (data) {
          this.getTeamDropdown();
          this.isShowCreateTeam = false;
          this.teamData.name = undefined;
        }
      });
    }
  }

  getTeamDropdown() {
    this.teamService.dropdownTeamGet$().subscribe(data => {
      console.log('data', data);
      this.teamList = [];
      for (const teamDropdown of data) {
        this.teamList.push({id: teamDropdown.id, name: teamDropdown.name});
      }
      console.log('team', this.teamList);
    });
  }

  onCreateTeam() {
    console.log('teamName', this.teamName);
    this.isShowCreateTeam = true;
  }

  onCancelCreateTeam() {
    this.isShowCreateTeam = false;
    this.teamData.name = undefined;
  }

  onTeamChange(event) {
    console.log('team', event);
    if (event) {
      this.agentData.team = {id: event.id};
    } else {
      this.agentData.team = null;
    }
  }

  onChangePlianFlag(event) {

    if (event) {
      this.agentData.plainComplexFlag = event.value;
    } else {
      this.agentData.plainComplexFlag = null;
    }
    console.log('plainComplexFlag', event);
    console.log('plainComplexFlag', this.agentData.plainComplexFlag);
  }

  bankOnchange(event) {
    console.log('event bank', event);
    if (event) {
      this.agentData.bank = {id: event.id};
    }
  }

  onChangeEmail(evnet, type) {

    if (type === 'email') {
      this.isEmailError = false;
    } else if ('') {
      this.isIcLicenseError = false;
    }
  }

  onSelectTeamLeader(event) {
    console.log('event teamleader', event);
    if (event) {
      console.log('event teamleader', event);
      this.agentData.isTeamLeader = event;
    }
  }
}
