import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, EventEmitter, Output, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { PnGridHeaderWrapperComponent } from './grid-header-wrapper/pn-grid-header-wrapper.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';

export interface GridTableColumn<PropType> { // extends TableColumn
  frozenLeft?: boolean;
  frozenRight?: boolean;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  sortable?: boolean;
  prop: keyof PropType | '_action';
  name?: string;
  cellTemplate?: any;
  headerTemplate?: any;
  cellClass?: string | ((data: any) => string | any);
  headerClass?: string | ((data: any) => string | any);
  summaryFunc?: (cells: any[]) => any;
  summaryTemplate?: any;
  placeholder?: string;
  sortBy?: string;
  groupHeader?: {
    name: string;
    align: 'left' | 'center' | 'right';
    isLast?: boolean;
  };
  sharedHeaderText?: string;
  sharedHeaderAlign?: string;
  flexGrow?: number;
  canAutoResize?: boolean;
  resizeable?: boolean;
}

export type FilterType = 'search' | 'equal' | ((row, prop) => boolean);

export interface FilterTypeObject {
  [prop: string]: FilterType;
}

export interface DataFilter {
  prop: string;
  data: any;
  type: FilterType;
}

export interface Page {
  page: number;
  perPage: number;
  totalCount: number;
}

export interface Sort {
  // column prop; send to ngx-datatable's sorts()
  prop: string;
  // sortBy field; send to server
  sortBy: string;
  // sortBy direction; send to server
  asc: boolean;
}

export interface RowReOrder<T> {
  row: T;
  oldIndex: number;
  newIndex: number;
}

@Component({
  selector: 'pn-lib-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class PnGridComponent<PropType> implements OnInit, OnDestroy, AfterViewInit {

  @Input() gridClass = '';

  // Loading
  loading: boolean;
  loadingSub: Subscription;
  @Input()
  set dataSub(dataSub: Subscription) {
    this.loadingSub = dataSub;
    if (dataSub) {
      // delay show loading
      const timeout = window.setTimeout(() => {
        this.loading = true;
      }, 300);
      new Promise((resolve) => {
        dataSub.add(resolve);
      }).then(() => {
        window.clearTimeout(timeout);
        this.loading = false;
      }).catch(() => {
        window.clearTimeout(timeout);
        this.loading = false;
      });
    }
  }
  enableSummary: boolean;
  gridTableColumns: GridTableColumn<any>[];
  @Input() set columns(columns: GridTableColumn<any>[]) {
    if (columns) {
      for (const column of columns) {
        if (column.resizeable === undefined) {
          column.resizeable = false;
        }
        if (column.sortable === undefined && this.externalSorting) {
          column.sortable = !!column.sortBy;
        }
        if (!column.headerTemplate) {
          column.headerTemplate = this.headerWrapper.template;
        }
        if (column.summaryFunc || column.summaryTemplate) {
          this.enableSummary = true;
        }
        if (column.canAutoResize === undefined) {
          column.canAutoResize = true;
        }
      }
      this.gridTableColumns = columns;
    }
  }

  filteredRows: PropType[];
  originalRows: PropType[];
  @Input()
  set rows(rows: PropType[]) {
    if (rows) {
      if (this.groupRowsBy) {
        // clear rowExpansions
        this.dataTable.bodyComponent.rowExpansions = [];
      }

      this.filteredRows = rows;
      this.originalRows = [...rows];
    }
  }
  @Input() scrollbarH = true;
  @Input() scrollbarV = false;
  @Input() rowHeight: number | 'auto' = 'auto';
  @Input() headerHeight: number | 'auto' = 54;
  @Input() footerHeight: number | 'auto' = 50;
  @Input() summaryHeight: number;
  @Input() summaryPosition: 'top' | 'bottom' = 'bottom';
  @Input() bodyHeight: number | 'auto' = 'auto';
  bodyHeightCalculate;

  @Input() externalPaging = false;
  @Input() page: Page;
  perPageOptions = [10, 25, 50, 100];

  @Input() filter: { [key: string]: any };

  @Input() externalSorting = true;
  @Input() sort: Sort;

  @Input() rowId: any;
  @Input() rowClass: any;
  @Input() groupRowsBy: string;
  @Input() groupExpansionDefault: boolean;
  @Input() groupRowsTemplate: TemplateRef<any>;
  @Input() selectionType: string | undefined = undefined;
  @Input() selected: PropType[] = [];
  @Input() displayCheck: any;
  @Input() selectAllRowsOnPage = false;


  @Output() rowsChange = new EventEmitter<PropType[]>();
  @Output() pageChange = new EventEmitter<Page>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() filterChange = new EventEmitter<{ [key: string]: any }>();
  @Output() edit = new EventEmitter<PropType>();
  @Output() delete = new EventEmitter<PropType>();
  @Output() visible = new EventEmitter<PropType>();
  @Output() selectedChange = new EventEmitter<any>();
  @Output() rowReOrderChange = new EventEmitter<RowReOrder<PropType>>();
  @Output() detailInfo = new EventEmitter<PropType>();

  @ViewChild('dataTable', { static: true }) dataTable: DatatableComponent;

  // header template
  @ViewChild('headerWrapper', { static: true }) headerWrapper: PnGridHeaderWrapperComponent;
  @ViewChild('noFilterHeaderWrapper', { static: true }) noFilterHeaderWrapper: PnGridHeaderWrapperComponent;
  @ViewChild('searchableHeaderWrapper', { static: true }) searchableHeaderWrapper: PnGridHeaderWrapperComponent;
  @ViewChild('datePickerHeaderWrapper', { static: true }) datePickerHeaderWrapper: PnGridHeaderWrapperComponent;
  @ViewChild('dateRangePickerHeaderWrapper', { static: true }) dateRangePickerHeaderWrapper: PnGridHeaderWrapperComponent;
  @ViewChild('monthPickerHeaderWrapper', { static: true }) monthPickerHeaderWrapper: PnGridHeaderWrapperComponent;
  @ViewChild('booleanHeaderWrapper', { static: true }) booleanHeaderWrapper: PnGridHeaderWrapperComponent;
  @ViewChild('inputNumberRangeHeaderWrapper', { static: true }) inputNumberRangeHeaderWrapper: PnGridHeaderWrapperComponent;

  // cell template
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('actionEditTpl', { static: true }) actionEditTpl: TemplateRef<any>;
  @ViewChild('actionDeleteTpl', { static: true }) actionDeleteTpl: TemplateRef<any>;
  @ViewChild('dateTpl', { static: true }) dateTpl: TemplateRef<any>;
  @ViewChild('dateTimeTpl', { static: true }) dateTimeTpl: TemplateRef<any>;
  @ViewChild('dateNumberTpl', { static: true }) dateNumberTpl: TemplateRef<any>;
  @ViewChild('timeTpl', { static: true }) timeTpl: TemplateRef<any>;
  @ViewChild('integerTpl', { static: true }) integerTpl: TemplateRef<any>;
  @ViewChild('decimalTpl', { static: true }) decimalTpl: TemplateRef<any>;
  @ViewChild('unitTpl', { static: true }) unitTpl: TemplateRef<any>;
  @ViewChild('percentTpl', { static: true }) percentTpl: TemplateRef<any>;
  @ViewChild('percentWithDecimalTpl', { static: true }) percentWithDecimalTpl: TemplateRef<any>;
  @ViewChild('reOrderTpl', { static: true }) reOrderTpl: TemplateRef<any>;
  @ViewChild('checkMarkTpl', { static: true }) checkMarkTpl: TemplateRef<any>;
  @ViewChild('colorTpl', { static: true }) colorTpl: TemplateRef<any>;
  @ViewChild('actionWithDetailTpl', { static: true }) actionWithDetailTpl: TemplateRef<any>;
  @ViewChild('detailTpl', { static: true }) detailTpl: TemplateRef<any>;
  @ViewChild('editAndSaveDraftTpl', { static: true }) editAndSaveDraftTpl: TemplateRef<any>;
  @ViewChild('valueTpl', { static: true }) valueTpl: TemplateRef<any>;


  private searchTerm$ = new Subject<DataFilter>();
  private pageChange$ = new Subject<Page>();
  private sortChange$ = new Subject<Sort>();
  private destroy$ = new Subject<boolean>();
  private sortablejs: any;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    const dataTableBody = document.getElementsByClassName('datatable-body') as HTMLCollectionOf<HTMLElement>;
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < dataTableBody.length; index++) {
      const element = dataTableBody[index];
      element.style.height = `calc(100% - 50px - 54px)`;
    }
    this.getBodyHeight();
  }

  ngOnInit() {
    if (this.groupRowsBy && this.groupExpansionDefault === undefined) {
      this.groupExpansionDefault = true;
    }

    this.searchTerm$
      .pipe(
        debounceTime(400),
        takeUntil(this.destroy$),
      )
      .subscribe((dataFilter: DataFilter) => {
        if (dataFilter.data && dataFilter.data.trim()) {
          this.filter[dataFilter.prop] = dataFilter.data;
        } else {
          this.filter[dataFilter.prop] = undefined;
        }
        this.filterChange.emit(this.filter);
      });

    this.pageChange$
      .pipe(
        debounceTime(400),
        takeUntil(this.destroy$),
      )
      .subscribe((page: Page) => this.pageChange.emit(page));

    this.sortChange$
      .pipe(
        debounceTime(400),
        takeUntil(this.destroy$),
      )
      .subscribe((sort: Sort) => this.sortChange.emit(sort));
  }

  getBodyHeight() {
    let heightCalculate = 0;
    if (typeof this.bodyHeight === 'number') {
      heightCalculate += this.bodyHeight;
      heightCalculate += typeof this.headerHeight === 'number' ? this.headerHeight : 54;
      heightCalculate += typeof this.footerHeight === 'number' ? this.footerHeight : 50;
      heightCalculate += 10;
    }
    this.bodyHeightCalculate = typeof this.bodyHeight === 'number' ? `${heightCalculate}px` : `${this.bodyHeight}`;
    this.cdr.detectChanges();
  }

  count() {
    if (this.page) {
      return this.page.totalCount;
    }
    return 0;
  }

  offset() {
    if (this.page) {
      return this.page.page - 1;
    }
    return 0;
  }

  limit() {
    if (this.page) {
      return this.page.perPage;
    }
    return undefined;
  }

  setPage(event) {
    const page: Page = {
      page: event.offset + 1,
      perPage: event.limit,
      totalCount: event.count,
    };
    this.pageChange$.next(page);
  }

  setPerPage(perPage) {
    console.log('perPage', perPage);
    const page: Page = {
      page: this.page.page,
      perPage: perPage.perPage,
      totalCount: this.page.totalCount,
    };
    this.pageChange$.next(page);
  }

  sorts() {
    if (this.sort) {
      return [
        {
          prop: this.sort.prop,
          dir: this.sort.asc ? 'asc' : 'desc',
        },
      ];
    }
    return undefined;
  }

  onSort(event) {
    if (!event.sorts) {
      return;
    }
    const sort: Sort = {
      prop: event.sorts[0].prop, // keep prop for sorts() to determine the column's arrow direction
      sortBy: event.column.sortBy || event.sorts[0].prop, // use custom sortBy attr with fallback to prop
      asc: event.sorts[0].dir === 'asc',
    };
    this.sort = sort;
    this.sortChange$.next(sort);
  }

  onSearch(column, value) {
    this.searchTerm$.next({
      prop: column.prop,
      data: value,
      type: 'search',
    });
  }

  onFilter(column) {
    this.filterChange.emit(this.filter);
  }

  onSelect({ selected }) {
    console.log('select', selected);
    if (selected) {
      console.log('Select Event in grid', selected, this.selected);
      this.selected.splice(0, this.selected.length);
      this.selected.push(...selected);
      this.selectedChange.emit({ select: this.selected , isAllow: this.selected.length === 0 ? false : true});
    } else {
      console.log('Noevent', selected, this.selected);
      this.selected.push(...selected);
      this.selectedChange.emit({ select: this.selected , index: this.selected});
    }
  }

  rowIdentity = row => {
    if (this.groupRowsBy) {
      // each group in groupedRows are stored as {key, value: [rows]},
      return row.key;
    }
    if (this.rowId) {
      return row[this.rowId];
    }
    return row;
    // tslint:disable-next-line:semicolon
  };

  selectCheck = (row, column, value) => {
    return true;
    // tslint:disable-next-line:semicolon
  };

  internalFilter(
    filter: { [prop: string]: any },
    filterType: FilterTypeObject,
  ) {
    let temp = this.originalRows;
    const props = Object.keys(filterType);
    for (const prop of props) {
      temp = temp.filter(row => {
        if (filterType[prop] === 'search') {
          return (
            row[prop].toLowerCase().indexOf(filter[prop]) !== -1 ||
            !filter[prop]
          );
        }
        if (filterType[prop] === 'equal') {
          return row[prop] === filter[prop] || !filter[prop];
        }
        if (typeof filterType[prop] === 'function') {
          return (filterType[prop] as (row, prop) => any)(row, prop);
        }
      });
    }
    this.filteredRows = temp;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
