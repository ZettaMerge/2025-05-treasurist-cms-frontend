import { Component, OnInit, Inject, Input, Output, EventEmitter, ContentChild, Optional, ViewChild, ElementRef } from '@angular/core';
import { WindowClass, windowToken } from './window';

import { ModalContent } from './modal-content';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbModalRef,
  NgbModalOptions,
  NgbModalConfig
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lib-modal',
  template: `
    <ng-template #modalContainer>
      <div class="modal-header" *ngIf="showHeader">
        <h4 class="modal-title">
          <ng-content select="lib-modal-title"></ng-content>
        </h4>
        <button type="button" class="close" aria-label="Close" (click)="dismiss()">
          <span aria-hidden="true"><i class="ic ic-cross"></i></span>
        </button>
      </div>
      <div class="modal-body">
        <ng-content></ng-content>
      </div>
      <!-- <div class="modal-footer" *ngIf="showFooter">
        <ng-content select="modal-footer" *ngIf="isCustomFooter"></ng-content>
        <button
          type="button"
          class="btn btn-secondary btn-raised"
          (click)="close()"
          *ngIf="!isCustomFooter">
          Close
        </button>
      </div> -->
    </ng-template>
  `
})
export class ModalComponent implements OnInit {
  @Input() modalClass = '';
  @Input() modalSize: 'sm' | 'md' |'lg' | 'xl';
  @Input() modalOption = {};
  @Input() isCustomFooter = false;
  @Input() showFooter = true;
  @Input() showHeader = true;
  // @Input() backdrop = false;

  @Output() opened = new EventEmitter();
  @Output() closed = new EventEmitter();
  @Output() removed = new EventEmitter();

  @ContentChild('modalContent') modalContent: ModalContent;
  @ContentChild('modalFooter') modalFooter: ElementRef;

  @ViewChild('modalContainer') modalContainer: ElementRef;

  // Tip: Use with ngIf for re-create modalContent every time opening
  isOpen = false;

  // Tip: Use with ngIf for prevent modalContent execute before open,
  // and would not re-create modalContent every time opening.
  isFirstOpen = false;

  private modalRef: NgbModalRef;

  constructor(
    @Inject(windowToken) protected _window: WindowClass,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private config: NgbModalConfig
  ) {
    this.config.backdrop = 'static';
  }

  ngOnInit() {
  }

  open() {
    this.isOpen = true;
    this.isFirstOpen = true;
    this.opened.emit();
    this._window.setTimeout(() => {
      this.modalRef = this.modalService.open(this.modalContainer, {
        size: this.modalSize,
        windowClass: this.modalClass,
        ...this.modalOption,
      });
      this.modalRef.result.then((result) => {
        this.close();
      }, (reason) => {
        this.close();
      });
    });
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
    this.modalRef.close();
  }

  dismiss(reason: String): void {
    this.isOpen = false;
    this.closed.emit();
    this.modalRef.dismiss();
  }

  remove() {
    this.isOpen = false;
    this.isFirstOpen = false;
    this.removed.emit();
  }

  // This function is used in open
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lib-modal-title',
  template: '<ng-content></ng-content>'
})
export class ModalTitleComponent { }

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lib-modal-footer',
  template: '<ng-content></ng-content>'
})
export class ModalFooterComponent { }
