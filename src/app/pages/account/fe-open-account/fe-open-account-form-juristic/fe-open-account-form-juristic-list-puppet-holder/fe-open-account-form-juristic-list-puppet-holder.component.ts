import { Component, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

interface PuppetHolderGeneral {
  nameDirector: string;
  nationality: any;
  idCard: string;
  expiryDate: string;
}

interface PuppetHolderJuristic {
  nameDirector: string;
  nationality: any;
  idCard: string;
  expiryDate: string;
}

@Component({
  selector: 'fe-open-account-form-juristic-list-puppet-holder',
  templateUrl: './fe-open-account-form-juristic-list-puppet-holder.component.html',
  styleUrls: ['./fe-open-account-form-juristic-list-puppet-holder.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FeOpenAccountFormJuristicListPuppetHolderComponent implements OnInit {
  dataPuppetHolderGeneral: PuppetHolderGeneral[] = [{
    nameDirector: '',
    nationality: {
      id: 415, type: 'NATIONALITY', name: 'Thai', value: 'TH'
    },
    idCard: '',
    expiryDate: undefined,
  }];

  dataPuppetHolderJuristic: PuppetHolderJuristic[] = [{
    nameDirector: '',
    nationality: {
      id: 415, type: 'NATIONALITY', name: 'Thai', value: 'TH'
    },
    idCard: '',
    expiryDate: undefined,
  }];
  constructor() { }

  ngOnInit(): void {
  }

  addPuppetHolderGeneral() {
    const data = {
      nameDirector: '',
      nationality: {
        id: 415, type: 'NATIONALITY', name: 'Thai', value: 'TH'
      },
      idCard: '',
      expiryDate: undefined
    };

    this.dataPuppetHolderGeneral.push(data);
  }

  onClickDelete(index) {
    console.log('onClickDelete', index);
    if (index > 0) {
      this.dataPuppetHolderGeneral.splice(index, 1);
    } else {
      const data = {
        nameDirector: '',
        nationality: {
          id: 415, type: 'NATIONALITY', name: 'Thai', value: 'TH'
        },
        idCard: '',
        expiryDate: undefined
      };
      this.dataPuppetHolderGeneral.splice(index, 2, data);
    }
  }

  addPuppetHolderJuristic() {
    const data = {
      nameDirector: '',
      nationality: {
        id: 415, type: 'NATIONALITY', name: 'Thai', value: 'TH'
      },
      idCard: '',
      expiryDate: undefined
    };

    this.dataPuppetHolderJuristic.push(data);
  }

  onDeletePuppetHolderJuristic(index) {
    console.log('onDeletePuppetHolderJuristic', index);
    if (index > 0) {
      this.dataPuppetHolderJuristic.splice(index, 1);
    } else {
      const data = {
        nameDirector: '',
        nationality: {
          id: 415, type: 'NATIONALITY', name: 'Thai', value: 'TH'
        },
        idCard: '',
        expiryDate: undefined
      };
      this.dataPuppetHolderJuristic.splice(index, 2, data);
    }

  }
}
