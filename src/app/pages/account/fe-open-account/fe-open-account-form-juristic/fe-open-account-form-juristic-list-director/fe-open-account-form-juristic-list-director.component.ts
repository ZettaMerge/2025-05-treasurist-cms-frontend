import {Component, OnInit} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {DropdownService} from "@api";

interface Director {
  nameDirector: string;
  nationality: any;
  idCard: string;
  signingAuthority: string;
  ceo: string;
}

@Component({
  selector: 'fe-open-account-form-juristic-list-director',
  templateUrl: './fe-open-account-form-juristic-list-director.component.html',
  styleUrls: ['./fe-open-account-form-juristic-list-director.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FeOpenAccountFormJuristicListDirectorComponent implements OnInit {

  dataDirector: Director[] = [{
    nameDirector: '',
    nationality: null,
    idCard: '',
    signingAuthority: null,
    ceo: null
  }];
  signingAuthorityList = [
    {id: 1, name: 'A'},
    {id: 2, name: 'B'},
    {id: 3, name: 'C'},
  ];

  constructor(
    protected dropdownService: DropdownService,
  ) {
  }

  ngOnInit(): void {
    this.setDefaultNationality();
  }


  setDefaultNationality() {

    this.dropdownService.dropdownNationalityGet$().subscribe(data => {
      const findNation = data.find(n => n.id === 415);
      this.dataDirector[0].nationality = findNation.name;
    });
  }


  onClickDelete(index) {
    console.log('onClickDelete', index);
    if (index > 0) {
      this.dataDirector.splice(index, 1);
    } else {
      const data = {
        nameDirector: '',
        nationality: {
          id: 415, type: 'NATIONALITY', name: 'Thai', value: 'TH'
        },
        idCard: '',
        signingAuthority: null,
        ceo: null
      };
      this.dataDirector.splice(index, 2, data);
    }

  }

  addDirector() {

    const data = {
      nameDirector: '',
      nationality: {
        id: 415, type: 'NATIONALITY', name: 'Thai', value: 'TH'
      },
      idCard: '',
      signingAuthority: null,
      ceo: null
    };

    this.dataDirector.push(data);
  }


}
