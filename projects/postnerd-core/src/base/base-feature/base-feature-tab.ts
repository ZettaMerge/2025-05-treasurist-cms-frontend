import { OnInit, Directive } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseFeatureComponent } from './base-feature';

@Directive()
export class BaseFeatureTabComponent extends BaseFeatureComponent  implements OnInit {

  activeTabId = 1;

  constructor(
    protected route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    if (this.route.snapshot.fragment) {
      this.activeTabId = parseInt(this.route.snapshot.fragment, 10);
    }
    super.ngOnInit();
  }
}

