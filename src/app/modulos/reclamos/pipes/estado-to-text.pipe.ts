import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoToText',
  standalone: true
})
export class EstadoToTextPipe implements PipeTransform {

  transform(estado: string): string {
    if(estado == 'PEN') return 'Pendiente';
    if(estado == 'POS') return 'Postergado';
    if(estado == 'PRO') return 'En proceso';
    if(estado == 'FIN') return 'Finalizado';
    if(estado == 'OTR') return 'Otro';
    return '';
  }

}
