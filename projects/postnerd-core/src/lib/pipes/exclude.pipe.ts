import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'exclude', pure: false })
export class ExcludePipe implements PipeTransform {
  transform(items: any[], excludeList: any[], compareProp: string): any[] {
    if (!items || !excludeList) {
      return items;
    }
    const excludeValues = [] as any[];
    for (let i = 0; i < excludeList.length; i++) {
      excludeValues.push(excludeList[i][compareProp]);
    }
    return items.filter(item => !excludeValues.includes(item[compareProp]));
  }
}
