import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe as DatePipeBase } from '@angular/common';

@Pipe({ name: 'bDateTime' })
export class BDateTimePipe extends DatePipeBase implements PipeTransform {

  transform(value: Date): any {
    if (value) {
      return super.transform(value, 'dd/MM/yyyy เวลา HH:mm');
    }
    return '';
  }
}
