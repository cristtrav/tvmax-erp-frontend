import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoToColor'
})
export class EstadoToColorPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if(value == 'PEN') return 'red';
    if(value == 'ASI') return 'red';
    if(value == 'PRO') return 'orange';
    if(value == 'POS') return 'magenta';
    if(value == 'FIN') return 'green';
    if(value == 'OTR') return 'purple';
    return '';
  }

}
