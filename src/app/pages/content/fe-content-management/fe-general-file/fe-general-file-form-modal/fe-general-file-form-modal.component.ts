import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentFileService, DropdownService } from '@api';
import { DocumentFileDTO } from '@model';
import { PopupService } from '@postnerd-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
@Component({
  selector: 'fe-general-file-form-modal',
  templateUrl: './fe-general-file-form-modal.component.html',
  styleUrls: ['./fe-general-file-form-modal.component.scss']
})
export class FeGeneralFileFormModalComponent implements OnInit, OnChanges {

  @Input() isNew;
  @Input() documentFileData: DocumentFileDTO = {} as DocumentFileDTO;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  categoryName: string;
  categoryCode: number;
  dataSub: Subscription;
  saveSub: Subscription;
  fileOther: string;
  constructor(
    private router: Router,
    private popupService: PopupService,
    private spinner: NgxSpinnerService,
    private documentFileService: DocumentFileService,
    private toastrService: ToastrService,
    private categoryService: DropdownService, ) { }

  ngOnInit(): void {
    console.log('documentFileData', this.documentFileData);
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.documentFileData) {
      this.getCategory();

    }
  }

  onSave(form) {
    this.spinner.show('global');
    if (form.invalid) {
      console.log('valid');
      this.spinner.hide('global');
      return;
    } else {

      console.log('this.documentFileData', this.documentFileData.isPublishToAgent);
      if (!this.isNew) {
        this.saveSub = this.documentFileService.documentFilesPut$(this.documentFileData, this.documentFileData.id).subscribe(data => {
          // console.log('save edit: ', data);
          this.spinner.hide('global');
          this.toastrService.success('แก้ไขข้อมูลเรียบร้อย.');
          this.save.emit();

        });
      } else {
        if (this.documentFileData.isPublishToAgent === undefined) {
          this.documentFileData.isPublishToAgent = false;
        }
        this.saveSub = this.documentFileService.documentFilesPost$(this.documentFileData).subscribe((data) => {
          // console.log('save: ', data);
          this.spinner.hide('global');
          this.toastrService.success('บันทึกข้อมูลเรียบร้อย.');
          this.save.emit();
        });
      }

    }
  }

  onCancel() {
    this.cancel.emit();
  }

  getCategory() {
    this.dataSub = this.categoryService.dropdownFileCategoryGet$().subscribe((data) => {
      const categoryFile = _.filter(data, (item) => item.name === this.documentFileData.docFileCategory);
      this.categoryCode = categoryFile[0]?.code;
    });
  }


  onChangCategory(event) {
    this.documentFileData.docFileType = undefined;
    this.categoryCode = undefined;
    if (event) {
      this.documentFileData.docFileCategory = event.name;
      this.categoryCode = event.code;
      this.fileOther = event.name;
    }
  }

  onChangType(event) {
    this.documentFileData.docFileType = event.name;
  }


}
