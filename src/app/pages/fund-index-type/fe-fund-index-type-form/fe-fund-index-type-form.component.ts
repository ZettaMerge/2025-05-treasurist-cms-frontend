import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FundIndexService } from '@api';
import { FundIndexDTO, IndexTypeDTO } from '@model';
import { PopupService } from '@postnerd-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

interface FundIndexCustomDTO extends FundIndexDTO {
  indexTypeIdsCustom?: any[];
  fundCodeCustom?: any;
}
@Component({
  selector: 'fe-fund-index-type-form',
  templateUrl: './fe-fund-index-type-form.component.html',
  styleUrls: ['./fe-fund-index-type-form.component.scss']
})
export class FeFundIndexTypeFormComponent implements OnInit, OnChanges {

  @Input() item: FundIndexCustomDTO = {} as FundIndexCustomDTO;
  @Input() isNew;

  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  indexTypeList: IndexTypeDTO[] = [];

  fundIndexData: FundIndexCustomDTO = {} as FundIndexCustomDTO;

  dataSub: Subscription;
  dropdownSub: Subscription;
  saveSub: Subscription;
  statusList = [
    { value: undefined, label: 'All' },
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' }
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private fundIndexService: FundIndexService,
    private popupService: PopupService,
    private toastrService: ToastrService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.getIndexTypeDropdown()
  }

  getIndexTypeDropdown() {
    if (this.dropdownSub) {
      this.dropdownSub.unsubscribe();
    }


    this.dropdownSub = this.fundIndexService.fundIndexIndexTypeListGet$(
      'name',
      'asc',
      true,
      9999,
      undefined,
      1
    ).subscribe(data => {
      this.indexTypeList = data.indexTypes;
    });

  }

  onSave(form) {
    this.spinner.show('global');

    if (form.invalid) {
      this.spinner.hide('global');
      return;
    } else {

      let req;

      if (this.isNew) {
        // set data
        this.item.fundCode = this.item.fundCodeCustom.fundCode;
        this.item.indexTypeIds = _.map(this.item.indexTypeIdsCustom, 'id');

        req = this.fundIndexService.fundIndexPost$(this.item);

        // console.log('item', this.item);
      } else {
        // set Data 
        this.item.fundCode = this.item.fundCodeCustom;
        this.item.indexTypeIds = _.map(this.item.indexTypeIdsCustom, 'id');
        let fundIndex: any = { fundCode: this.item.fundCodeCustom, indexTypeIds: this.item.indexTypeIds };

        req = this.fundIndexService.fundIndexPut$(fundIndex);
        // console.log('itemss edit', fundIndex);
      }

      this.saveSub = req.subscribe(res => {
        console.log('res...save ', res);
        this.spinner.hide('global');
        this, this.save.emit();

      }, (error) => {

        // console.log('error', error);
        if (error && error.error) {
          let err = JSON.parse(error.error)
          // console.log('er....', err);
          this.toastrService.error(err.errorMessage)

        }

        this.spinner.hide('global');
      })
    }

  }

  onCancel() {
    this.cancel.emit();
  }

  changeFund(event) {
    console.log('fundcode', event)
  }

  onIndexTypeChange(event) {
    console.log('indextypeList', event);

  }
}

