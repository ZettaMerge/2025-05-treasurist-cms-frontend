import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe as DecimalPipeBase } from '@angular/common';

@Pipe({ name: 'aDecimal' })
export class DecimalPipe extends DecimalPipeBase implements PipeTransform {
  constructor() {
    super('en-US');
  }
  public transform(value: number, fromPlace = '2', toPlace?: string): any {
    toPlace = toPlace || fromPlace;
    return super.transform(value, `1.${fromPlace}-${toPlace}`);
  }
}
