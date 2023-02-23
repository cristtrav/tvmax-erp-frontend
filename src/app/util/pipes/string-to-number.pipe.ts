import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToNumber',
  standalone: true
})
export class StringToNumberPipe implements PipeTransform {

  transform(value: string | number | null): number {
    if(typeof value == 'number') return value;
    if(typeof value == 'string') return Number(value);
    return 0;
  }

}
