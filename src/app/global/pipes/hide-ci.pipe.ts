import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideCi',
  standalone: true
})
export class HideCiPipe implements PipeTransform {

  transform(value: string | number | undefined | null): string {
    if(value == null || `${value}`.length <= 3) return '';
    return `${value}`.substring(`${value}`.length - 3).padStart(`${value}`.length, 'X');
  }

}
