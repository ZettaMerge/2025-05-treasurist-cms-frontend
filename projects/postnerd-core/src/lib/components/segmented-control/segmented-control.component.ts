import { Component, OnInit, Input, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
import { BaseInput } from 'projects/postnerd-core/src/base';

@Component({
  selector: 'pn-segmented-control',
  templateUrl: './segmented-control.component.html',
  styleUrls: ['./segmented-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SegmentedControlComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedControlComponent extends BaseInput implements OnInit {

  // !  NOTE:
  // !  ถ้าอยากใช้ icon ให้ส่งเข้ามาในรูปแบบของ unicode ที่ขึ้นต้นด้วย \u
  // !  เช่น   unicode icon คือ e98e  ช้อมูลที่ส่งมาใน label คือ \ue98e

  @Input() list: { value: string | boolean; label: string; }[];
  @Input() name: string;
  @Input() haveIcon;

  @ViewChild('bg', { static: true }) bg: ElementRef;
  @ViewChild('content', { static: true }) content: ElementRef;

  constructor(
    protected cdr: ChangeDetectorRef,
  ) {
    super(cdr);
  }

  ngOnInit(): void {
  }

  onClick(e, index) {
    this.bg.nativeElement.style.left = `${e.srcElement.offsetLeft - 5}px`;
    this.bg.nativeElement.style.width = `${e.srcElement.parentElement.offsetWidth}px`;
  }

  writeValue(value: any): void {
    if (value || (typeof value === 'boolean')) {
      this.value = value;
    } else if (this.list.length > 0) {
      this.value = this.list[0].value;
    } else {
      this.value = undefined;
    }

    setTimeout(() => {
      if (this.content.nativeElement.children.length > 0) {
        const findIndex = _.findIndex(this.list, (l) => l.value === this.value);
        const left = this.content.nativeElement.children[findIndex].offsetLeft;

        this.bg.nativeElement.style.left = `${left + 4}px`;
        this.bg.nativeElement.style.width = `${this.content.nativeElement.children[findIndex].offsetWidth}px`;
      }
      this.cdr.markForCheck();
    }, 100);

  }

}
