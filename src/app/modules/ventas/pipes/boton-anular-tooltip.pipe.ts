import { Pipe, PipeTransform } from '@angular/core';
import { Venta } from '@dto/venta.dto';

@Pipe({
  name: 'botonAnularTooltip'
})
export class BotonAnularTooltipPipe implements PipeTransform {

  transform(venta: Venta): string {
    if(!venta.facturaelectronica && venta.anulado) return 'Revertir anulación';
    if(
      venta.facturaelectronica &&
      venta.anulado && 
      (venta.idestadodte == 1 || venta.idestadodte == 2)
    ) return 'Para revertir la anulación de la factura se debe anular la nota de crédito asociada.';
    if(venta.facturaelectronica && !venta.anulado && venta.idestadodte == 30)
      return 'No se puede anular: Factura pendiente de envío a SIFEN';
    if(venta.facturaelectronica && venta.anulado && venta.idestadodte == 32)
      return 'No se puede anular: Factura pendiente de aprobación por SIFEN';
    if(venta.facturaelectronica && !venta.anulado && venta.idestadodte == 3 )
      return 'No se puede anular: Factura rechazada por SIFEN';
    if(venta.facturaelectronica && venta.anulado && venta.idestadodte == 4)
      return 'No se puede revertir la cancelación de una factura electrónica';
    
    return 'Anular';
  }

}
