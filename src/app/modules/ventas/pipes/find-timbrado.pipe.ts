import { Pipe, PipeTransform } from '@angular/core';
import { Timbrado } from '@dto/timbrado.dto';

@Pipe({
  name: 'findTimbrado'
})
export class FindTimbradoPipe implements PipeTransform {

  transform(value: number | null, lstTimbrados: Timbrado[]): Timbrado | null {
    if(!value) return null;
    return lstTimbrados.find(t => t.id == value) ?? null;
  }

}
