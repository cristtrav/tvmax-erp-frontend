import { Pipe, PipeTransform } from '@angular/core';
import { Venta } from '@dto/venta.dto';

@Pipe({
  name: 'botonEliminarDisabled'
})
export class BotonEliminarDisabledPipe implements PipeTransform {

  transform(venta: Venta): boolean {
    if(
      venta.facturaelectronica &&
      (
        venta.idestadodte == 1 ||
        venta.idestadodte == 2 ||
        venta.idestadodte == 4 ||
        venta.idestadodte == 32
      )
    ) return true;
    return false;
  }

}
