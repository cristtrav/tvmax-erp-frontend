import { Pipe, PipeTransform } from '@angular/core';
import { Venta } from '@dto/venta.dto';

@Pipe({
  name: 'botonAnularDisabled'
})
export class BotonAnularDisabledPipe implements PipeTransform {

  transform(venta: Venta): boolean {
    if(!venta.facturaelectronica) return false;
    if(venta.facturaelectronica && venta.anulado) return true;
    if(
      venta.facturaelectronica &&
      !venta.anulado &&
      (venta.idestadodte == 1 || venta.idestadodte == 2)
    ) return false;
    if(
      venta.facturaelectronica &&
      !venta.anulado &&
      (venta.idestadodte != 1 && venta.idestadodte != 2)
    ) return true;    
    return true;
  }

}
