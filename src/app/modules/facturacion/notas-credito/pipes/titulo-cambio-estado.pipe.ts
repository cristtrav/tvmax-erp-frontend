import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tituloCambioEstado'
})
export class TituloCambioEstadoPipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if(value == 1 || value == 2) return 'F. Aprobación';
    if(value == 3) return 'F. Rechazo';
    if(value == 4) return 'F. Cancelación';
    if(value == 30) return 'F. Creación';
    if(value == 32) return 'F. Envío';
    return 'F.Cambio Estado';
  }

}
