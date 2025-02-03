import { Pipe, PipeTransform } from '@angular/core';
import { Talonario } from '@dto/facturacion/talonario.dto';

@Pipe({
  name: 'datosTalonario'
})
export class DatosTalonarioPipe implements PipeTransform {

  transform(talonario: Talonario, mostrarTipo?: boolean): string {
    if(!talonario) return '';
    const ultNro = (talonario.ultimonrousado ?? 0).toString().padStart(7, '0');
    const nroInicio = (talonario.nroinicio ?? 0).toString().padStart(7, '0');
    const nroFin = (talonario.nrofin ?? 0).toString().padStart(7, '0');
    const tipo = talonario.electronico ? '[E]' : '[P]'
    let datosTimb = `${talonario.prefijo} | ${nroInicio} al ${nroFin} | ${ultNro}`;
    if(mostrarTipo) datosTimb = `${datosTimb} ${tipo}`;
    return datosTimb;
  }

}
