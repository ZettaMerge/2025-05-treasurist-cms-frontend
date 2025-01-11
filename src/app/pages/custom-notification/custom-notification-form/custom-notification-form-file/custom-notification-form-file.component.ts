import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges, TemplateRef,
  ViewChild
} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {NgxSpinnerService} from 'ngx-spinner';
import {DocumentFileService} from '@api';
import {CustomNotificationsDTO, DocumentFileDTO} from '@model';
import {BaseFeatureGridComponent} from '@postnerd-core';
import {Subscription} from 'rxjs';
import {debounce} from 'lodash';

interface DocumentFileCustom extends DocumentFileDTO {
  isAllow?: boolean;
}

interface FilterType {
  search: string;
  docFileCategory: string;
  docFileType: string;
}

@Component({
  selector: 'custom-notification-form-file',
  templateUrl: './custom-notification-form-file.component.html',
  styleUrls: ['./custom-notification-form-file.component.scss']
})
export class CustomNotificationFormFileComponent extends BaseFeatureGridComponent<DocumentFileCustom, any> implements OnInit, OnDestroy, OnChanges {

  @ViewChild('noTpl', {static: true}) noTpl: TemplateRef<any>;
  @ViewChild('selectTpl', {static: true}) selectTpl: TemplateRef<any>;

  @Input() fileListData;
  @Input() fileListOriginal;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  dataSub: Subscription;
  fileList: DocumentFileCustom[] = [];
  fileOther: string;
  categoryCode: number;

  page = {
    page: 1,
    perPage: 10,
    totalCount: 0,
  };

  filter: FilterType = {} as FilterType;

  canLoadMore = true;


  constructor(
    private spinner: NgxSpinnerService,
    private documentFileService: DocumentFileService,
  ) {
    super();
    this.searchTextChange = debounce(this.searchTextChange, 1000);
  }

  ngOnChanges(changes: SimpleChanges) {

    // กรณีตอนแก้ไข แบบมี ID
    console.log('fileData', this.fileListData);
    console.log('this.fileList', this.fileListOriginal);

    if (this.fileListData) {
      this.getData();
      super.ngOnInit();
      // this.getFileList();
    }
  }

  ngOnInit(): void {


    if (!this.fileListData) {
      this.getData();
      super.ngOnInit();
      // this.getFileList();
    }
  }

  searchTextChange(event: string) {
    this.page.page = 1;
    this.getData();
  }

  protected setColumns() {
    this.columns = [
      // {
      //   name: 'No',
      //   prop: 'id',
      //   width: 80,
      //   sortable: false,
      //   cellClass: 'align-items-center',
      //   headerClass: 'align-items-center',
      //   cellTemplate: this.noTpl
      // },
      {
        name: 'File Name',
        prop: 'name',
        sortable: false,
        width: 200,
        cellClass: 'align-items-center text-wrap',
        headerClass: 'align-items-center',
      },
      {
        name: 'ประเภทเอกสาร',
        prop: 'docFileType',
        width: 150,
        sortable: false,
        cellClass: 'align-items-center text-wrap',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.valueTpl
      },
      {
        name: 'Upload Date',
        prop: 'updatedDate',
        sortable: false,
        width: 80,
        cellClass: 'align-items-center',
        headerClass: 'align-items-center',
        cellTemplate: this.grid.dateTimeTpl
      },
      {
        name: '',
        prop: 'isAllow',
        sortable: false,
        width: 80,
        cellClass: 'justify-content-end',
        headerClass: 'align-items-center',
        cellTemplate: this.selectTpl
      },
    ];
  }

  getData() {
    this.spinner.show('global');
    this.documentFileService.documentFilesListGet$(
      this.page.perPage,
      this.page.page,
      this.filter.docFileCategory,
      this.filter.docFileType,
      this.filter.search,
    ).subscribe(data => {
      console.log('get file data', data);
      this.rows = data.documentFiles;
      this.page.totalCount = data.pagination.allRecord;

      // SET DATA
      if (this.fileListData.length >= 0) {
        for (const fileListData of this.fileListData) {
          const findIndexSelect = _.findIndex(this.rows, i => i.id === fileListData.id);

          console.log('findIndexSelect', findIndexSelect);
          if (findIndexSelect >= 0) {
            this.rows[findIndexSelect].isAllow = true;
          }

        }
      }
      this.spinner.hide('global');
    });
  }

  onSelectChange(event, item, id) {
    console.log('event', event);
    if (id && item.isAllow === false) {
      const findIndex = _.findIndex(this.fileListData, i => i.id === id);
      this.fileListData.splice(findIndex, 1);
    } else {
      this.fileListData.push(item);
      this.fileListData = _.uniqBy(this.fileListData, 'id');
    }
    console.log('fileList', this.fileList);
    console.log('fileListData', this.fileListData);

  }

  onSelectChanges(event, index) {
  }

  onSave() {
    console.log('fileListData', this.fileListData);
    if (this.fileListData) {
      // check ว่า file isAllow === true
      const fileIsAllow = _.groupBy(this.fileListData, 'isAllow');
      const fileIsTrue = fileIsAllow.true;

      if (fileIsTrue) {
        this.fileListData = fileIsTrue;
        this.save.emit(this.fileListData);
        console.log('fileIsTrue', fileIsTrue);
      } else {
        this.fileListData = [];
        this.save.emit(this.fileListData);
      }


    }
  }

  onCancel() {
    this.cancel.emit();
  }


  onChangCategory(event) {
    console.log('onChangCategory', event);
    console.log('onChangCategory', this.filter.docFileCategory);
    this.filter.docFileType = undefined;
    this.categoryCode = undefined;
    if (event) {
      this.filter.docFileCategory = event.name;
      this.categoryCode = event.code;
      this.fileOther = event.name;
      this.page.page = 1;
      this.getData();
    } else {
      this.filter.docFileCategory = undefined;
      this.filter.docFileType = undefined;
      this.categoryCode = undefined;
      this.page.page = 1;
      this.getData();
    }
  }

  onChangType(event) {
    if (event) {
      this.filter.docFileType = event.name;
      this.page.page = 1;
      this.getData();
    } else {
      this.filter.docFileType = undefined;
      this.page.page = 1;
      this.getData();
    }
  }

  clearFilter() {
    this.filter = {
      search: undefined,
      docFileCategory: undefined,
      docFileType: undefined,
    } as FilterType;

    this.page.page = 1;
    this.getData();
  }

}
