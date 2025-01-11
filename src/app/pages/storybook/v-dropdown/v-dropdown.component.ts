import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'v-dropdown',
  templateUrl: './v-dropdown.component.html',
  styleUrls: ['./v-dropdown.component.scss']
})
export class VDropdownComponent implements OnInit {

  lists = [
    { id: 1, name: 'test 1' },
    { id: 2, name: 'test 2' },
    { id: 3, name: 'test 3' },
    { id: 4, name: 'test 4' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
