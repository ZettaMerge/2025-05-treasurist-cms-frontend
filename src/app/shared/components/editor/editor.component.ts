import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
  forwardRef,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'shared-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true,
    },
  ],
})
export class EditorComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() placeholder = '';
  @Input() required: boolean;
  @Input() disabled = false;

  value: any;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: 'auto',
    minHeight: '300px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'subscript', 'superscript', 'fontName'
      ],
      [
        'fontSize',
        'backgroundColor',
        'insertVideo',
        'insertHorizontalRule',
        'customClasses',
      ]
      // ['subscript', 'superscript', 'fontName'],
      // ['fontSize', 'backgroundColor', 'customClasses', 'insertVideo', 'insertHorizontalRule',]
    ],
    customClasses: [
      {
        name: 'Image Small',
        class: '_small',
        tag: 'img'
      },
      {
        name: 'Image Medium',
        class: '_medium',
        tag: 'img',
      },
      {
        name: 'Image Large',
        class: '_large',
        tag: 'img',
      },
      {
        name: 'Image Large',
        class: '_large',
        tag: 'h1',
      },
    ]
  };

  constructor(
    protected cdr?: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  myCustomFunction(event) {
    console.log('myCustomFunction', event);
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  onChangeEditor(event) {
    this.onChange(event);
  }

  private onChange = (_: any) => {
  }
  private onTouched = (_: any) => {
  }

}
