import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'pn-data-not-found',
  templateUrl: './data-not-found.component.html',
  styleUrls: ['./data-not-found.component.scss']
})
export class DataNotFoundComponent implements OnInit, AfterViewInit {

  @Input() image = 'assets/img/data_not_found.png';
  @Input() title = 'ไม่พบข้อมูล';
  @Input() message = 'ระบบไม่สามารถแสดงรายการได้ เนื่องจากไม่พบรายการข้อมูล หรือ ไม่มีข้อมูลตามเงื่อนไขการค้นหาที่ระบุ';
  @Input() addButton = 'เพิ่ม';
  @Input() addButtonIcon = 'ic-plus';
  @Input() clearFilterButton = 'ล้างฟิลเตอร์';
  @Input() clearFilterButtonIcon = 'ic-rotate-right';
  @Input() isShowActionTemplate = true;
  @Input() isShowAddButton = true;
  @Input() isShowImage = true;
  @Input() isShowMessage = true;
  @Output() add = new EventEmitter<any>();
  @Output() clearFilter = new EventEmitter<any>();

  @ViewChild('containerDataNotFound', { static: true }) containerDataNotFound: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: ElementRef;

  contentWidth = 0;
  hasContentChildren: boolean;

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.contentWidth = this.containerDataNotFound.nativeElement.offsetWidth;
    console.log('containerDataNotFound', this.contentWidth);
    // this.hasContentChildren = this.actionTpl.nativeElement.children.length > 0;
    this.cdr.markForCheck();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // this.innerWidth = window.innerWidth;
    this.contentWidth = this.containerDataNotFound.nativeElement.offsetWidth;
  }

  onAdd() {
    this.add.emit();
  }

  onClearFilter() {
    this.clearFilter.emit();
  }


}
