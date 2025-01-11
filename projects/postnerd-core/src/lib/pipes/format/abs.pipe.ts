import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe as DecimalPipeBase } from '@angular/common';

@Pipe({ name: 'anAbs' })
export class AbsPipe extends DecimalPipeBase implements PipeTransform {
  constructor() {
    super('en-US');
  }
  public transform(value: number): any {
    if (!value) {
      return '';
    }
    let formatted = '';
    formatted = super.transform(value, '1.0-0');
    if (value < 0) {
      formatted = `(${formatted.substring(1)})`;
    }
    return formatted;
  }
}
