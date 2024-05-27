import { Pipe, PipeTransform } from '@angular/core';
import { DetalleReclamoDTO } from '@global-dtos/reclamos/detalle-reclamo.dto';

@Pipe({
  name: 'detallesReclamosToText',
  standalone: true
})
export class DetallesReclamosToTextPipe implements PipeTransform {

  transform(detalles: DetalleReclamoDTO[] | null | undefined): string {
    if(detalles == null) return '';
    return(detalles.map(d => d.motivo).join(', '));
  }

}
