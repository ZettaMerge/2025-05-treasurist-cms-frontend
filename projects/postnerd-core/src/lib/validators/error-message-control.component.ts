import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'error-message-control',
  template: `<p class="helper text-accent input-error-detail">{{_text}}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageControlComponent {

  _text: string;

  @Input() set text(value) {
    if (value !== this._text) {
      this._text = value;
      this.cdr.detectChanges();
    }
  }

  constructor(private cdr: ChangeDetectorRef) { }

}
