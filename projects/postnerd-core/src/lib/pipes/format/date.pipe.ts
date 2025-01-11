import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe as DatePipeBase } from '@angular/common';

@Pipe({ name: 'aDate' })
export class DatePipe extends DatePipeBase implements PipeTransform {

  transform(value: Date): any {
    if (value) {
      return super.transform(value, 'dd/MM/yyyy');
    }
    return '';
  }
}
