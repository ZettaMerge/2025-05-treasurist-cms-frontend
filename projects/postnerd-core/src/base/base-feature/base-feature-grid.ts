import { ViewChild, OnInit, Directive } from '@angular/core';
import { GridTableColumn, PnGridComponent } from '../../lib/components/grid/pn-grid.component';
import { ModalComponent } from '../../lib/components/modal/modal.component';
import { BaseFeatureComponent } from './base-feature';

@Directive()
export class BaseFeatureGridComponent<PropType, FilterType = any> extends BaseFeatureComponent implements OnInit {

  @ViewChild('grid', { static: true }) grid: PnGridComponent<PropType>;
  @ViewChild('modal') modal: ModalComponent;

  // table
  rows: PropType[];
  columns: GridTableColumn<PropType>[];
  page = {
    page: 1,
    perPage: 10,
    totalCount: 0,
  };
  // sortBy = listAdminSortByEnum;
  sort = {
    prop: undefined,
    sortBy: undefined,
    asc: undefined,
  } as {
    prop: string;
    sortBy: any;
    asc: boolean;
  };
  filter = {} as FilterType;

  // data
  item: PropType;
  oItem: PropType;
  isNew: boolean;

  ngOnInit() {
    this.setColumns();
  }

  pageChange() {
    this.getData();
  }

  sortChange() {
    this.page.page = 1;
    this.getData();
  }

  filterChange(event?) {
    if (event) {
      this.filter = event;
    }
    this.page.page = 1;
    this.getData();
  }

  add() {
    delete this.oItem;
    this.item = {} as PropType;
    this.isNew = true;
    this.modal.open();
  }

  edit(item) {
    this.oItem = item;
    this.item = { ...item } as PropType;
    this.isNew = false;
    this.modal.open();
  }

  detailInfo(item) {
    this.item = { ...item } as PropType;
    this.modal.open();
  }

  protected setColumns() {
    this.columns = [];
  }

  protected getData() {
    this.rows = [];
  }
}
