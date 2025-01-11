import { OnInit, OnDestroy, Directive } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export class BaseFeatureComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<boolean>();

  constructor(
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
