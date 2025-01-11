import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'readable' })
export class ReadablePipe implements PipeTransform {
  transform(value: string, args: boolean): string {

    if (typeof (value) !== 'string') {
      return value;
    }

    if (value === value.toUpperCase()) {
      return value;
    }

    return value
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/([A-Za-z][0-9])/g, (match) => `${match[0]} ${match[1]}`)
      .replace(/^./, (match) => match.toUpperCase());
  }
}
