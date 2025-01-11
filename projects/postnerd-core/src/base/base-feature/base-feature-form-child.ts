import { Directive, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseFeatureComponent } from './base-feature';
import { Observable } from 'rxjs';

export interface CanDeactivateChildComponent {
  canDeactivate(): boolean | Observable<boolean>;
}

@Directive()
export class BaseFeatureFormChildComponent extends BaseFeatureComponent implements CanDeactivateChildComponent {

  @ViewChild('form') form: NgForm;

  canDeactivate(): boolean {
    return !this.form || this.form.submitted || !this.form.dirty;
  }
}
