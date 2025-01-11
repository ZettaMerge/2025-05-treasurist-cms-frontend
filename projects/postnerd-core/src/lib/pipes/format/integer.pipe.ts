import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe as DecimalPipeBase } from '@angular/common';

@Pipe({ name: 'anInteger' })
export class IntegerPipe extends DecimalPipeBase implements PipeTransform {
  constructor() {
    super('en-US');
  }
  public transform(value: number): any {
    return super.transform(value, '1.0-0');
  }
}
