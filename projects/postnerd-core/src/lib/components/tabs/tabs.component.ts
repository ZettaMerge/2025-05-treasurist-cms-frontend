import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pn-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {

  @Input() tabs: { id: string, name: string }[];
  @Input() activeTabId: number;
  @Input() isInsideModal = false;
  @Output() activeTabIdChange = new EventEmitter<number>();

  constructor(
    private router: Router,
  ) { }

  changeTab(tab: { id: number, name: string }) {
    this.activeTabId = tab.id;
    // if (!this.isInsideModal) {
    //   this.router.navigate([], { replaceUrl: true, fragment: tab.id.toString() });
    // }
    this.activeTabIdChange.emit(tab.id);
  }

}
