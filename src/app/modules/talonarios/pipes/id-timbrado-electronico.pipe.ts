import { Pipe, PipeTransform } from '@angular/core';
import { TimbradoDTO } from '@dto/facturacion/timbrado.dto';

@Pipe({
  name: 'isTimbradoElectronico'
})
export class IsTimbradoElectronicoPipe implements PipeTransform {

  transform(nrotimbrado: number, lstTimbrados: TimbradoDTO[]): boolean {
    return lstTimbrados.find(t => t.nrotimbrado == nrotimbrado)?.electronico ?? false;
  }

}
