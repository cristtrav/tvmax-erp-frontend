import { Pipe, PipeTransform } from '@angular/core';
import { TimbradoDTO } from '@dto/facturacion/timbrado.dto';

@Pipe({
  name: 'findTimbrado'
})
export class FindTimbradoPipe implements PipeTransform {

  transform(nrotimbrado: number, lstTimbrados: TimbradoDTO[]): TimbradoDTO | null {
    return lstTimbrados.find(t => t.nrotimbrado == nrotimbrado) ?? null;
  }

}
