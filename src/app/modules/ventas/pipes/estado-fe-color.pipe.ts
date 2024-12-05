import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoFeColor'
})
export class EstadoFeColorPipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if(value == 1 || value == 2) return 'green';
    if(value == 3) return 'red';
    if(value == 4 || value == 30 || value == 31) return 'orange';
    return '';
  }

}
