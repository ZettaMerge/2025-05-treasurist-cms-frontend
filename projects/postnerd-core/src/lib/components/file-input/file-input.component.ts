import { Component, Input, ViewChild, ChangeDetectionStrategy, forwardRef, EventEmitter, Output } from '@angular/core';

import { Subscription } from 'rxjs';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInput } from '../../../base/base-input/base-input';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'pn-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FileInputComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputComponent extends BaseInput {

  @ViewChild('fileInput') fileInput;

  @Input() classInput;
  @Input() accept: string;
  @Input() multiple: boolean;
  @Input() imageUrl: string;
  @Input() iconUpload = 'ic-picture';
  @Input() width: string;
  @Input() height: string;

  @Output() onImageSelect = new EventEmitter<any>();

  value: File;
  wasChanged = false;

  loadingSub: Subscription;

  imageCoverPreview;
  imageCoverPreviewFile;

  @Input() set uploadSub(uploadSub: Subscription) {
    this.loadingSub = uploadSub;
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          this.onValueChange(file);
          this.onImageSelect.emit(file);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  removeImageCover() {
    this.imageCoverPreview = null;
    this.imageCoverPreviewFile = undefined;
    this.onValueChange(undefined);
  }

  writeValue(value: any): void {
    if (!value && this.wasChanged) {
      this.fileInput.clear();
    }
    super.writeValue(value);
  }

  clear() {
    this.fileInput.clear();
  }
}
