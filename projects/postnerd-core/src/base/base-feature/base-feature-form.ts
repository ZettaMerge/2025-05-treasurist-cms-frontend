import { HostListener, Directive, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseFeatureComponent } from './base-feature';
import { Observable } from 'rxjs';

export interface CanDeactivateComponent {
  canDeactivate(): boolean | Observable<boolean>;
  beforeUnload($event: any): void;
}

@Directive()
export class BaseFeatureFormComponent extends BaseFeatureComponent implements CanDeactivateComponent {

  @ViewChild('form') form: NgForm;

  canDeactivate(): boolean {
    return !this.form || this.form.submitted || !this.form.dirty;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload($event: any): void {
    if (!this.canDeactivate()) {
      $event.returnValue = 'Changes you made may not be saved.';
    }
  }
}
