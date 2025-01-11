import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe as DatePipeBase } from '@angular/common';

@Pipe({ name: 'aDateTime' })
export class DateTimePipe extends DatePipeBase implements PipeTransform {

  transform(value: Date): any {
    if (value) {
      return super.transform(value, 'dd/MM/yyyy HH:mm');
    }
    return '';
  }
}
