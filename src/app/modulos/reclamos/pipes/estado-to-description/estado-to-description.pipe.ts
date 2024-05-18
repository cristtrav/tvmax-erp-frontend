import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoToDescription'
})
export class EstadoToDescriptionPipe implements PipeTransform {

  transform(value: string | null | undefined, observacionEstado?: string): string {
    if(value == 'PEN') return 'Pendiente';
    if(value == 'ASI') return 'Asignado';
    if(value == 'PRO') return 'En proceso';
    if(value == 'POS') return 'Postergado';
    if(value == 'FIN') return 'Finalizado';
    if(value == 'OTR') return observacionEstado ? observacionEstado : 'Otro';
    return '';
  }

}
