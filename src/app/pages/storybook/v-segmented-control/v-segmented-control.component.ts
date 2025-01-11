import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'v-segmented-control',
  templateUrl: './v-segmented-control.component.html',
  styleUrls: ['./v-segmented-control.component.scss']
})
export class VSegmentedControlComponent implements OnInit {

  isTableView = false;
  status = 'inactive';
  status2 = 'active';
  toggleView = 'grid';

  list = [
    { value: undefined, label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];
  list2 = [
    { value: undefined, label: 'All' },
    { value: 'active', label: 'General Customer' },
    { value: 'inactive', label: 'Vulnerable Customer' }
  ];
  listIcon = [
    { value: 'grid', label: '\ue98e' },
    { value: 'table', label: '\ue83b' }
  ];

  code = '\ue83b';
  constructor() { }

  ngOnInit(): void {
  }

}
