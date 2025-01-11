import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FundService } from '@api';
import { FundChangeNameDTO, FundDropdownDTO, FundNavDTO } from '@model';
import * as _ from 'lodash';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fe-update-fund-name',
  templateUrl: './fe-update-fund-name.component.html',
  styleUrls: ['./fe-update-fund-name.component.scss']
})
export class FeUpdateFundNameComponent implements OnInit {

  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  fundData: any;
  changeFundNameData: any;
  fundNameList: any[] = []

  dataSub: Subscription;
  saveSub: Subscription;


  constructor(
    private spinner: NgxSpinnerService,
    private fundService: FundService,
    private toastrService: ToastrService,

  ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.cancel.emit();
  }

  onChangeFund(event) {

    if (event) {

      this.getChangeName();
    } else {
      this.fundNameList = [];

    }
  }

  getChangeName() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.fundService.fundChangeNameDropdownGet$(this.fundData?.fundCode).subscribe(
      data => {
        this.spinner.hide('global');
        this.fundNameList = [];
        if (data && data.length !== 0) {
          _.map(data, item => {
            this.fundNameList.push({
              id: item.id,
              name: item.fundCode,
              value: item.fundCode
            })
          })

        }
        // this.fundNameList = data;
        console.log('data', data);

      }, error => {
        this.spinner.hide('global');
      }
    )

  }

  onChangeFundName(event) {


  }

  onSave(form) {
    this.spinner.show('global')

    if (form.invalid) {
      this.spinner.hide('global')
      return;
    } else {

      // SET DATA
      let changeFundName: FundChangeNameDTO = {
        fundCode: this.fundData?.fundCode,
        targetFundCode: this.changeFundNameData?.value
      } as FundChangeNameDTO;

      this.saveSub = this.fundService.fundChangeNamePost$(changeFundName).subscribe(data => {
        this.spinner.hide('global');
        this.toastrService.success('Update Fund Name Success.');
        this.save.emit();
      }, error => {
        this.spinner.hide('global');

      })

    }

  }

}

