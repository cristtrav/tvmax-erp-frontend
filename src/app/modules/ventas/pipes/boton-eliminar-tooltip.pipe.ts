import { Pipe, PipeTransform } from '@angular/core';
import { Venta } from '@dto/venta.dto';

@Pipe({
  name: 'botonEliminarTooltip'
})
export class BotonEliminarTooltipPipe implements PipeTransform {

  transform(venta: Venta): string {
    if(
      venta.facturaelectronica &&
      (venta.idestadodte == 1 ||
      venta.idestadodte == 2)
    ) return 'No se puede eliminar: Factura aprobada por SIFEN';
    if(venta.facturaelectronica && venta.idestadodte == 4)
      return 'No se puede eliminar: Factura anulada por SIFEN';
    if(venta.facturaelectronica && venta.idestadodte == 32)
      return 'No se puede eliminar: Factura pendiente de aprobación por SIFEN';
    return 'Eliminar';
  }

}
