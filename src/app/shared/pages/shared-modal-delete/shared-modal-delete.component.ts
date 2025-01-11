import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';

@Component({
  selector: 'shared-modal-delete',
  templateUrl: './shared-modal-delete.component.html',
  styleUrls: ['./shared-modal-delete.component.scss']
})
export class SharedModalDeleteComponent implements OnInit {

  @Input() id: any = 1;
  @Input() title: string;
  @Input() message: string;
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onSave(event) {
    this.save.emit(this.id);
    console.log('console.log', this.id);
  }

  onCancel() {
    this.cancel.emit();
  }

}
