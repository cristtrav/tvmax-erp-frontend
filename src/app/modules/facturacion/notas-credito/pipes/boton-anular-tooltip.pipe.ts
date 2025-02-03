import { Pipe, PipeTransform } from '@angular/core';
import { NotaCreditoDTO } from '@dto/facturacion/nota-credito.dto';

@Pipe({
  name: 'botonAnularTooltip'
})
export class BotonAnularTooltipPipe implements PipeTransform {

  transform(nota: NotaCreditoDTO): string {
    if(nota.idestadodte == 30)
      return 'No se puede anular: La nota de crédito está pendiente de envio a SIFEN';
    else if(nota.idestadodte == 32)
      return 'No se puede anular: La nota de crédito está pendiente de aprobación por SIFEN';
    else if(nota.idestadodte == 3)
      return 'No se puede anular: La nota de crédito fue rechazada por SIFEN';
    else if(nota.idestadodte == 4)
      return 'La nota de crédito ya fue anulada';
    else return 'Anular';
  }

}
