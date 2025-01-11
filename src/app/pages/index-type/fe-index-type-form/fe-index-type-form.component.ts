import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FundIndexService } from '@api';
import { IndexTypeDTO } from '@model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fe-index-type-form',
  templateUrl: './fe-index-type-form.component.html',
  styleUrls: ['./fe-index-type-form.component.scss']
})
export class FeIndexTypeFormComponent implements OnInit {
  @Input() item: IndexTypeDTO = {} as IndexTypeDTO;
  @Input() isNew;

  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  indexTypeList = [
    { id: 1, name: 'Equity' },
    { id: 2, name: 'Money Market' },
  ];
  statusList = [
    { value: undefined, label: 'All' },
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' }
  ];

  dataSub: Subscription;
  saveSub: Subscription;

  constructor(
    private spinner: NgxSpinnerService,
    private fundIndexService: FundIndexService,
    private toastrService: ToastrService,

  ) { }

  ngOnInit(): void {
    if (this.isNew) {
      this.item.isActive = true;
    }

  }

  onChange(event) {

  }

  onStatusChange(event) {


  }

  onSave(form) {

    this.spinner.show('global');

    if (form.invalid) {
      this.spinner.hide('global');
      return;


    } else {

      let req;

      if (this.isNew) {

        console.log('item', this.item);
        req = this.fundIndexService.fundIndexIndexTypePost$(this.item);

      } else {

        console.log('item have id', this.item);
        req = this.fundIndexService.fundIndexIndexTypePut$(this.item.id, this.item);
      }

      this.saveSub = req.subscribe(res => {
        console.log('ress...', res)
        this.spinner.hide('global');
        this.save.emit();

      }, (error) => {
        this.spinner.hide('global');

      })




    }

  }

  onCancel() {
    this.cancel.emit();
  }

}
