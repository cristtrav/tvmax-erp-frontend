import { Pipe, PipeTransform } from '@angular/core';
import { Timbrado } from '@dto/timbrado.dto';

@Pipe({
  name: 'datosTimbrado'
})
export class DatosTimbradoPipe implements PipeTransform {

  transform(timb: Timbrado, mostrarTipo?: boolean): string {
    if(!timb) return '';
    const ultNro = (timb.ultimonrousado ?? 0).toString().padStart(7, '0');
    const nroInicio = (timb.nroinicio ?? 0).toString().padStart(7, '0');
    const nroFin = (timb.nrofin ?? 0).toString().padStart(7, '0');
    const tipo = timb.electronico ? '[E]' : '[P]'
    let datosTimb = `${timb.prefijo} | ${nroInicio} al ${nroFin} | ${ultNro}`;
    if(mostrarTipo) datosTimb = `${datosTimb} ${tipo}`;
    return datosTimb;
  }

}
