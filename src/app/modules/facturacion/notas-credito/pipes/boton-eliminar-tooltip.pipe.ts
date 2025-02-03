import { Pipe, PipeTransform } from '@angular/core';
import { NotaCreditoDTO } from '@dto/facturacion/nota-credito.dto';

@Pipe({
  name: 'botonEliminarTooltip'
})
export class BotonEliminarTooltipPipe implements PipeTransform {

  transform(nota: NotaCreditoDTO,): string {
    if(nota.idestadodte == 1 || nota.idestadodte == 2)
      return 'No se puede eliminar: La nota de crédito ya fué aprobada por SIFEN';
    else return 'Eliminar';
  }

}
