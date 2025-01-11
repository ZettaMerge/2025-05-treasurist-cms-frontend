import * as moment from 'moment';

export function dateRequestFormatter(date: Date): string {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

export function dateResponseReviver(key: string, value: string): string | Date {
  let a;
  if (typeof value === 'string' && value.length === 19) {
    a = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(value);
    if (a) {
      return moment(value, 'YYYY-MM-DD HH:mm:ss').toDate();
    }
  }
  return value;
}
