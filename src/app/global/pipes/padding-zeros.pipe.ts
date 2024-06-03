import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paddingZeros',
  standalone: true
})
export class PaddingZerosPipe implements PipeTransform {

  transform(value: number | null, totalDigits: number): string {
    if(value == null) return ''
    else return value.toString().padStart(totalDigits, '0');
  }

}
