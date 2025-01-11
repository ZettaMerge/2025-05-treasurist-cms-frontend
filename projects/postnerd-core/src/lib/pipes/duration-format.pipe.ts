import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/*
* format the duration time that not more than 24 hours
*/
@Pipe({ name: 'durationFormat' })
export class DurationFormatPipe implements PipeTransform {
  /*
  * @params seconds number of duration in seconds
  * @params ...format time format, remove 0 value if set multiple args
  */
  transform(seconds: number, ...format: string[]): string {
    if (seconds || seconds === 0) {
      const ms = seconds * 1000;
      if (format.length === 1) {
        return moment.utc(ms).format(format[0]);
      }
      let formatted = '';
      const isZero = /^00?[^\d]|[^\d]00?$|[^\d]00?[^\d]/;
      for (const f of format) {
        const text = moment.utc(ms).format(f);
        if (!isZero.test(text)) {
          formatted = `${formatted} ${text}`;
        }
      }
      return formatted.trim();
    }
    return '';
  }
}
