import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe as DatePipeBase } from '@angular/common';
import * as moment from 'moment';

@Pipe({ name: 'dateYear' })
export class DateYearPipe extends DatePipeBase implements PipeTransform {

  transform(value): any {
    if (value && value !== 'N/A') {
      const convertDate = moment(value, 'YYYYMMDD');
      value = convertDate.format('DD/MM/yyyy');
      // return super.transform(value, 'DD/MM/YYYY');
      return (value);
    } else {
      return '-';
    }
    return '';
  }
}
