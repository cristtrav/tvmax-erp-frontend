import { Pipe, PipeTransform } from '@angular/core';
import { NumberToWords } from '@util/number-to-words';

@Pipe({
  name: 'numeroALetras',
  standalone: true
})
export class NumeroALetrasPipe implements PipeTransform {

  transform(value: number | null): string {
    if(value == null) return ''
    else return NumberToWords.convert(value);
  }

}
