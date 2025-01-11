import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe as DatePipeBase } from '@angular/common';

@Pipe({ name: 'aTime' })
export class TimePipe extends DatePipeBase implements PipeTransform {

  transform(value: Date): any {
    if (value) {
      return super.transform(value, 'HH:mm');
    }
    return '';
  }
}
